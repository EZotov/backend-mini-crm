import {CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor} from '@nestjs/common';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable()
export class PostStatusInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();

        return next.handle().pipe(
            tap(() => {
                // Проверяем, что запрос был POST и NestJS уже выставил ему дефолтный статус 201
                if (request.method === 'POST' && response.statusCode === HttpStatus.CREATED) {
                    response.status(HttpStatus.OK);
                }
            }),
        );
    }
}
