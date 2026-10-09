import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';

import {JwtPayload} from '@interfaces/auth.interface';

import {CreateUserDto} from '../user/dto/user.dto';
import {UserService} from '../user/user.service';
import {LoginDto, LoginRequestDto} from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async registration(dto: CreateUserDto): Promise<LoginDto> {
        const createdUserId = await this.userService.createUser(dto);

        return this.generateAuthTokensByUserId(createdUserId);
    }

    async login(dto: LoginRequestDto): Promise<LoginDto> {
        const {id} = await this.userService.getUserByCredentials(dto);

        return this.generateAuthTokensByUserId(id);
    }

    async logout() {}

    async generateAuthTokensByUserId(userId: string): Promise<LoginDto> {
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

        const accessToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_ACCESS_SECRET'),
            expiresIn: this.configService.get('JWT_ACCESS_EXPIRES'),
        });

        return accessToken;
    }
}
