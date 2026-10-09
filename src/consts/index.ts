import {FindOptionsOrder} from 'typeorm';

export const DEFAULT_ORDER: FindOptionsOrder<unknown> = {createdAt: 'DESC'};

export const PAGE_SIZES = [25, 50, 100];

export const PASSWORD_SALT = 10;

// Временный список ролей пока не реализована система доступа по действиям
export const ROLES = {
    ADMIN: 'ADMIN',
    USER: 'USER',
} as const;

export const REG_EXP = {
    PASSWORD: /^[a-zA-Z0-9]+$/,
};

export const ACCESS_TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';
