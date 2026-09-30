import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';

import {AuthenticatedRequest, JwtPayload} from '../types';

const ACCESS_TOKEN_KEY = 'access_token';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    // Внедряем встроенный JwtService из @nestjs/jwt
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
        const authHeader = request.headers?.authorization;

        let token = (request.cookies?.[ACCESS_TOKEN_KEY] as string) || null;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }

        if (!token) {
            throw new UnauthorizedException('Необходима аутентификация (токен отсутствует)');
        }

        try {
            const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
            request.user = payload;
        } catch (error) {
            console.error(error);
            throw new UnauthorizedException('Неверный или просроченный токен');
        }

        return true;
    }
}
