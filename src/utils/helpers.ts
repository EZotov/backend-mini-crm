import {BadRequestException} from '@nestjs/common';
import {hash} from 'bcrypt';
import type {Response} from 'express';
import {EntityTarget, ObjectLiteral, QueryDeepPartialEntity, Repository, UpdateResult} from 'typeorm';

import {PAGE_SIZES, PASSWORD_SALT, REFRESH_TOKEN_KEY} from '@consts/index';

type CookieOptions = {
    isProduction: boolean;
    days?: number;
};

/**
 * Хелпер получения offset (кол-ва записей для пропуска) для READ запросов в БД
 * @param pageNum
 * @param pageSize
 * @returns - кол-во пропущенных записей
 */
export const getOffsetAndCheckPaginationParams = (pageNum: number, pageSize: number) => {
    if (!PAGE_SIZES.includes(pageSize) || pageNum < 1) {
        throw new BadRequestException('Параметры пагинации неверны');
    }

    return (pageNum - 1) * pageSize;
};

/**
 * Хелпер для установки refreshToken в куки
 * @param res
 * @param token
 * @param options
 */
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

/**
 * Хелпер очистки refreshToken в куках
 * @param res
 * @param options
 */
export const clearRefreshTokenCookie = (res: Response, isProduction: CookieOptions['isProduction'] = true) => {
    res.clearCookie(REFRESH_TOKEN_KEY, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        maxAge: 0,
    });
};

/**
 * Хелпер получения захэшированного пароля
 * @param password
 * @param confirmPassword
 * @returns
 */
export const getHashedPassword = async (password: string, confirmPassword: string) => {
    if (!password || !confirmPassword) {
        throw new BadRequestException('Один или оба пароля пусты');
    }

    if (password !== confirmPassword) {
        throw new BadRequestException('Пароли не совпадают');
    }

    const hashedPassword = await hash(password, PASSWORD_SALT);

    return hashedPassword;
};

/**
 * Обертка над QueryBuilder для быстрого атомарного обновления сущности за один SQL-запрос.
 * Напрямую обновляет плоские поля и внешние ключи (Foreign Keys) со стороны владельца связи
 * (отношения ManyToOne и OneToOne с @JoinColumn) без предварительного SELECT.
 *
 * Защищена от SQL-инъекций. Избавляет от ресурсоемких операций полного цикла репозитория .save().
 * @param repository
 * @param entity
 * @param id
 * @param flatDto
 * @param rawRelations
 * @param params
 * @returns - UpdateResult из БД
 */
export const updateByIdWithRelations = async <T extends ObjectLiteral>(
    repository: Repository<T>,
    entity: EntityTarget<T>,
    id: string,
    flatDto: ObjectLiteral,
    relations?: Record<string, string | null | undefined>,
): Promise<UpdateResult> => {
    const setData = {...flatDto} as QueryDeepPartialEntity<T>;
    const metadata = repository.metadata;

    if (relations) {
        for (const [relationKey, relationId] of Object.entries(relations)) {
            // Ищем метаданные связи по названию свойства в классе
            const relationMetadata = metadata.findRelationWithPropertyPath(relationKey);

            if (relationMetadata) {
                // Получаем наименование первого свойства
                const targetPropertyName = relationMetadata.joinColumns?.[0]?.propertyName;

                if (targetPropertyName) {
                    if (relationId === null) {
                        setData[targetPropertyName] = null;
                    } else if (relationId !== undefined) {
                        setData[targetPropertyName] = relationId;
                    }
                }
            }
        }
    }

    return repository.createQueryBuilder().update(entity).set(setData).where('id = :id', {id}).execute();
};

export const combineUserSessionKey = (userId: string) => `user:session:id:${userId}`;
