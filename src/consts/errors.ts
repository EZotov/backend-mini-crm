import {UnauthorizedException} from '@nestjs/common';

export const JWT_ERRORS = {
    JWT_EXPIRED: 'TokenExpiredError',
    JWT_INVALID: 'JsonWebTokenError',
};

export const loginError = new UnauthorizedException('Неверные почта или пароль');
export const authError = new UnauthorizedException('Необходима авторизация');
