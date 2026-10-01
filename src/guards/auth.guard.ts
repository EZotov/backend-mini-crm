import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';

import {AuthenticatedRequest, JwtPayload} from '@interfaces/auth.interface';

const ACCESS_TOKEN_KEY = 'access_token';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    // Внедряем встроенный JwtService из @nestjs/jwt
    // constructor(private readonly jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
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
            const payload = {} as JwtPayload;
            request.user = payload;
        } catch (error) {
            console.error(error);
            throw new UnauthorizedException('Неверный или просроченный токен');
        }

        return true;
    }
}
