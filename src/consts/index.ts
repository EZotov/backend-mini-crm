import {FindOptionsOrder} from 'typeorm';

export const DEFAULT_ORDER: FindOptionsOrder<unknown> = {createdAt: 'DESC'};

export const PAGE_SIZES = [25, 50, 100];

export const PASSWORD_SALT = 10;

// Временный список ролей пока не реализована система доступа по действиям, пока проверка в лоб по названию роли
export const ROLES = {
    ADMIN: 'ADMIN',
    MANAGER: 'MANAGER',
    USER: 'USER',
} as const;

export const REG_EXP = {
    PASSWORD: /^[a-zA-Z0-9]+$/,
    UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
};

export const ACCESS_TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';
