import {createParamDecorator, ExecutionContext} from '@nestjs/common';

/**
 * Декоратор получения данных из куки
 */
export const Cookie = createParamDecorator((key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return key ? request.cookies?.[key] : request.cookies;
});
