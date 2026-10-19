import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    ServiceUnavailableException,
    UnauthorizedException,
} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';
import {InjectRedis} from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

import {JwtPayload} from '@interfaces/auth.interface';
import {combineUserSessionKey} from '~/utils/helpers';

import {CreateUserDto} from '../user/dto/user.dto';
import {UserService} from '../user/user.service';
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
                secret: this.configService.get('JWT_ACCESS_SECRET'),
                expiresIn: this.configService.get('JWT_ACCESS_EXPIRES'),
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: '1d',
            }),
        ]);

        return {accessToken, refreshToken};
    }

    async generateAccessTokenByRefreshToken(refreshToken: string): Promise<string> {
        const payload = this.jwtService.decode<JwtPayload>(refreshToken, {json: true});

        const session = await this.getSession(payload.id);

        if (!session || session.refreshToken !== refreshToken) {
            await this.deleteSession(payload.id);
            throw new UnauthorizedException('Сессия истекла или скомпрометирована');
        }

        const accessToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_ACCESS_SECRET'),
            expiresIn: this.configService.get('JWT_ACCESS_EXPIRES'),
        });

        return accessToken;
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

    async getSession(userId: string): Promise<SessionData | null> {
        const key = combineUserSessionKey(userId);

        try {
            const result = await this.redisService.hgetall(key);

            if (!result || Object.keys(result).length === 0) {
                return null;
            }

            return result as unknown as SessionData;
        } catch (error) {
            console.error(error);
            throw new ServiceUnavailableException('Ошибка в получении сессии. Возможно соединение с Redis потеряно');
        }
    }

    async saveSession(data: SessionData) {
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

    async deleteSession(userId: string): Promise<void> {
        const key = combineUserSessionKey(userId);

        await this.redisService.del(key);
    }
}
