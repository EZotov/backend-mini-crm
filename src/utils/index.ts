import {BadRequestException} from '@nestjs/common';
import type {Response} from 'express';

import {PAGE_SIZES, REFRESH_TOKEN_KEY, REG_EXP} from '~/consts';

type CookieOptions = {
    isProduction: boolean;
    days?: number;
};

export const isUUID = (value: string): boolean => REG_EXP.UUID.test(value);

export const getOffsetAndCheckPaginationParams = (pageNum: number, pageSize: number) => {
    if (!PAGE_SIZES.includes(pageSize) || pageNum < 1) {
        throw new BadRequestException('Параметры пагинации неверны');
    }

    return (pageNum - 1) * pageSize;
};

export const setRefreshTokenInCookie = (res: Response, token: string, options?: CookieOptions) => {
    const isProduction = options?.isProduction ?? true;
    const days = options?.days ?? 1;

    res.cookie(REFRESH_TOKEN_KEY, token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        maxAge: days * 24 * 60 * 60 * 1000,
    });
};

export const clearRefreshTokenCookie = (res: Response, options: CookieOptions) => {
    const isProduction = options?.isProduction ?? true;

    res.clearCookie(REFRESH_TOKEN_KEY, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        maxAge: 0,
    });
};
