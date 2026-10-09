import {BadRequestException} from '@nestjs/common';
import type {Response} from 'express';

import {PAGE_SIZES, REFRESH_TOKEN_KEY} from '~/consts';

type SetCookieOptions = {
    isProduction: boolean;
    days: number;
};

export const isUUID = (value: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
};

export const getOffsetAndCheckPaginationParams = (pageNum: number, pageSize: number) => {
    if (!PAGE_SIZES.includes(pageSize) || pageNum < 1) {
        throw new BadRequestException('Параметры пагинации неверны');
    }

    return (pageNum - 1) * pageSize;
};

export const setRefreshTokenInCookie = (res: Response, token: string, options?: SetCookieOptions) => {
    const isProduction = options?.isProduction ?? true;
    const days = options?.days ?? 1;

    res.cookie(REFRESH_TOKEN_KEY, token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        maxAge: days * 24 * 60 * 60 * 1000,
    });
};
