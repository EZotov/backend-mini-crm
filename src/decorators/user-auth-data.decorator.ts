import {createParamDecorator, ExecutionContext} from '@nestjs/common';

import type {AuthenticatedRequest, JwtPayload} from '@interfaces/auth.interface';

/**
 * Декоратор получения user-данных их токена
 */
export const UserTokenData = createParamDecorator((payloadKey: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    return payloadKey && user ? user[payloadKey] : user;
});
