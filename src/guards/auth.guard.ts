import {Injectable, UnauthorizedException} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {AuthGuard, PassportStrategy} from '@nestjs/passport';
import type {Request} from 'express';
import {ExtractJwt, Strategy} from 'passport-jwt';

import {authError, JWT_ERRORS} from '@consts/errors';
import {ACCESS_TOKEN_KEY} from '@consts/index';
import {JwtPayload} from '@interfaces/auth.interface';
import {AuthService} from '~/modules/auth/auth.service';
import {UserService} from '~/modules/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        readonly configService: ConfigService,
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromAuthHeaderAsBearerToken(),
                (request: Request) => {
                    return request?.cookies?.[ACCESS_TOKEN_KEY] || null;
                },
            ]),
            secretOrKeyProvider: (_, __, done) => done(null, configService.get<string>('JWT_ACCESS_SECRET')),
        });
    }

    async validate(payload: JwtPayload): Promise<JwtPayload> {
        if (!payload) {
            throw new UnauthorizedException('Невалидный токен');
        }

        const existSession = await this.authService.checkSession(payload.id);

        if (!existSession) {
            throw authError;
        }

        const user = await this.userService.getUserById(payload.id);

        if (!user) {
            throw authError;
        }

        return {id: user.id, email: user.email, role: user.role?.title};
    }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(error, user, info) {
        if (error) {
            throw error;
        }

        if (info?.name === JWT_ERRORS.JWT_EXPIRED) {
            throw new UnauthorizedException('Срок действия токена истек.');
        }

        if (info?.name === JWT_ERRORS.JWT_INVALID) {
            throw new UnauthorizedException('Невалидный токен.');
        }

        if (!user) {
            throw authError;
        }

        return user;
    }
}
