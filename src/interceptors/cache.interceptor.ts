import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {InjectRedis} from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import {Observable, of, tap} from 'rxjs';

export const CACHE_TTL_METADATA = 'cache_ttl_metadata';

@Injectable()
export class RedisCacheInterceptor implements NestInterceptor {
    constructor(
        @InjectRedis() private readonly redisService: Redis,
        private readonly reflector: Reflector,
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();

        const ttl = this.reflector.getAllAndOverride<number>(CACHE_TTL_METADATA, [
            context.getHandler(),
            context.getClass(),
        ]);

        // Кэшируем только GET-запросы
        if (request.method !== 'GET') {
            return next.handle();
        }

        const cacheKey = `cache:${request.url}`;

        try {
            const cachedData = await this.redisService.get(cacheKey);

            if (cachedData) {
                return of(JSON.parse(cachedData));
            }
        } catch (error) {
            console.error('Redis read error:', error);
        }

        return next.handle().pipe(
            tap((responseBody) => {
                if (responseBody) {
                    this.redisService
                        .set(cacheKey, JSON.stringify(responseBody), 'EX', ttl)
                        .catch((error) => console.error('Redis write error:', error));
                }
            }),
        );
    }
}
