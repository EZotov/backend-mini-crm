import {ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger} from '@nestjs/common';
import {Response} from 'express';
import {QueryFailedError} from 'typeorm';

import {ErrorResponseDto} from '@dto/errors.dto';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(ExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let loggerMessage = 'Unknown error';
        let loggerStack = '';

        if (exception instanceof Error) {
            loggerMessage = exception.message;
            loggerStack = exception.stack ?? '';
        }

        this.logger.error(loggerMessage, loggerStack);

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        const errorResponse: ErrorResponseDto = {
            code: null,
            message: 'Internal Server Error',
        };

        // Ошибки Http Exception
        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const response = exception.getResponse() as ErrorResponseDto | string;

            if (typeof response === 'object') {
                errorResponse.code = response?.code ?? errorResponse.code;
                errorResponse.message = response?.message ?? errorResponse.message;
            } else if (typeof response === 'string') {
                errorResponse.message = response;
            }
        }

        // Общие ошибки БД
        if (exception instanceof QueryFailedError) {
            const dbErrorCode = exception?.driverError?.code as string;

            switch (dbErrorCode) {
                case '23505': {
                    status = HttpStatus.CONFLICT;
                    errorResponse.message = 'Запись с такими данными уже существует';
                    break;
                }
                default:
                    errorResponse.message = 'Ошибка при выполнении операции в базе';
                    break;
            }
        }

        response.status(status).json(errorResponse);
    }
}
