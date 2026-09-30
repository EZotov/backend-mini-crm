import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {AuthenticatedRequest, JwtPayload} from '~/modules/auth/types';

export const UserTokenData = createParamDecorator((data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    return data && user ? user[data] : user;
});
