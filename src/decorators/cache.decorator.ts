import {applyDecorators, SetMetadata, UseInterceptors} from '@nestjs/common';

import {CACHE_TTL_METADATA, RedisCacheInterceptor} from '~/interceptors/cache.interceptor';

/**
 * Декоратор для кэширования эндпоинта в Redis
 * @param ttl
 * @returns
 */
export const RedisCached = (ttl: number = 60) =>
    applyDecorators(SetMetadata(CACHE_TTL_METADATA, ttl), UseInterceptors(RedisCacheInterceptor));
