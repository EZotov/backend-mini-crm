import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
    UnauthorizedException,
} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {JsonWebTokenError, JwtService} from '@nestjs/jwt';
import {InjectRedis} from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

import {JWT_ERRORS} from '@consts/errors';
import {JwtPayload} from '@interfaces/auth.interface';
import {ENV_KEYS_CONFIG} from '~/configs/env';
import {combineUserSessionKey} from '~/utils/helpers';

import {CreateUserDto} from '../user/dto/user.dto';
import {UserService} from '../user/services/user.service';
import {LoginDto, LoginRequestDto} from './dto/auth.dto';
import {SessionData} from './types';

@Injectable()
export class AuthService {
    private readonly SESSION_TTL = 1 * 24 * 60 * 60; // 1 день

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        @InjectRedis() private readonly redisService: Redis,
    ) {}

    async registration(dto: CreateUserDto): Promise<LoginDto> {
        const createdUserId = await this.userService.createUser(dto);

        const tokens = await this.generateAuthTokensByUserId(createdUserId);

        return {
            userId: createdUserId,
            ...tokens,
        };
    }

    async login(dto: LoginRequestDto): Promise<LoginDto> {
        const {id} = await this.userService.getUserByCredentials(dto);

        const tokens = await this.generateAuthTokensByUserId(id);

        return {
            userId: id,
            ...tokens,
        };
    }

    async logout(userId: string) {
        const isExist = await this.checkSession(userId);

        if (!isExist) {
            throw new BadRequestException('Сессия пользователя не найдена');
        }

        await this.deleteSession(userId);
    }

    async generateAuthTokensByUserId(userId: string): Promise<{accessToken: string; refreshToken: string}> {
        const payload: JwtPayload = {
            id: userId,
        };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get(ENV_KEYS_CONFIG.JWT_ACCESS_SECRET),
                expiresIn: this.configService.get(ENV_KEYS_CONFIG.JWT_ACCESS_EXPIRES),
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get(ENV_KEYS_CONFIG.JWT_REFRESH_SECRET),
                expiresIn: '1d',
            }),
        ]);

        return {accessToken, refreshToken};
    }

    async generateAccessTokenByRefreshTokenPayload(
        refreshPayload: JwtPayload,
        refreshToken: string,
        session?: SessionData,
    ): Promise<string> {
        if (!session) {
            throw new UnauthorizedException('Сессия истекла или скомпрометирована');
        }

        if (session.refreshToken !== refreshToken) {
            await this.deleteSession(refreshPayload.id);
            throw new UnauthorizedException('Токен обновления скомпрометирован');
        }

        const accessToken = await this.jwtService.signAsync(refreshPayload, {
            secret: this.configService.get(ENV_KEYS_CONFIG.JWT_ACCESS_SECRET),
            expiresIn: this.configService.get(ENV_KEYS_CONFIG.JWT_ACCESS_EXPIRES),
        });

        await this.updateAccessInSession(refreshPayload.id, accessToken);

        return accessToken;
    }

    async getOrRefreshAccessToken(refreshToken: string): Promise<string> {
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh-токен не передан');
        }

        let refreshTokenPayload;

        try {
            // Валидируем Refresh Token. Если он протух, метод упадет с ошибкой JWT.
            refreshTokenPayload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get(ENV_KEYS_CONFIG.JWT_REFRESH_SECRET),
            });
        } catch (error) {
            if (error instanceof JsonWebTokenError) {
                if (error.name === JWT_ERRORS.JWT_EXPIRED) {
                    throw new UnauthorizedException('Срок действия refresh-токена истек.');
                }

                if (error.name === JWT_ERRORS.JWT_INVALID) {
                    throw new UnauthorizedException('Невалидный refresh-токен.');
                }
            }
        }

        // Получаем сессию. Наш getSession сам выбросит ошибку, если сессии нет в Redis.
        const session = await this.getSession(refreshTokenPayload.id);

        try {
            // Проверяем старый Access Token на валидность и срок действия
            await this.jwtService.verifyAsync(session.accessToken, {
                secret: this.configService.get(ENV_KEYS_CONFIG.JWT_ACCESS_SECRET),
            });

            // Если verifyAsync не выбросил ошибку — токен еще «живой», возвращаем его
            return session.accessToken;
        } catch {
            // 5. Если старый токен истек (выбросилась ошибка), генерируем новый
            return this.generateAccessTokenByRefreshTokenPayload(
                {
                    id: refreshTokenPayload.id,
                    email: refreshTokenPayload?.email,
                    role: refreshTokenPayload?.role,
                },
                refreshToken,
                session,
            );
        }
    }

    // Sessions

    async checkSession(userId: string): Promise<boolean> {
        const key = combineUserSessionKey(userId);

        try {
            const result = await this.redisService.exists(key);

            return result === 1;
        } catch (error) {
            console.error(error);
            throw new ServiceUnavailableException('Ошибка в проверке сессии. Возможно соединение с Redis потеряно');
        }
    }

    async getSession(userId: string): Promise<SessionData> {
        const key = combineUserSessionKey(userId);

        const isExist = await this.checkSession(userId);

        if (!isExist) {
            throw new InternalServerErrorException('Сессия не найдена или уже истекла');
        }

        const result = await this.redisService.hgetall(key);

        return result as unknown as SessionData;
    }

    async saveSession(data: SessionData): Promise<void> {
        const key = combineUserSessionKey(data.userId);

        try {
            const pipeline = this.redisService.pipeline();

            pipeline.hset(key, data);
            pipeline.expire(key, this.SESSION_TTL);

            const results = await pipeline.exec();

            const hasError = results?.some(([err]) => err !== null);

            if (hasError) {
                throw new InternalServerErrorException('Ошибка при выполнении команд в Redis Pipeline');
            }
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Ошибка при сохранении сессии');
        }
    }

    async updateAccessInSession(userId: SessionData['userId'], accessToken: SessionData['accessToken']): Promise<void> {
        const key = combineUserSessionKey(userId);

        const isExist = await this.checkSession(userId);

        if (!isExist) {
            throw new NotFoundException('Сессия не найдена или уже истекла');
        }

        await this.redisService.hset(key, 'accessToken', accessToken);
    }

    async deleteSession(userId: string): Promise<void> {
        const key = combineUserSessionKey(userId);

        await this.redisService.del(key);
    }
}
