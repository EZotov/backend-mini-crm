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

        // Парсинг http Exception
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

        // Парсинг ошибок драйвера БД
        if (exception instanceof QueryFailedError) {
            const dbErrorCode = exception?.driverError?.code as string;

            switch (dbErrorCode) {
                case '23505': {
                    status = HttpStatus.CONFLICT;
                    errorResponse.message = 'Запись с такими данными уже существует';
                    break;
                }
                case '40P01':
                    status = HttpStatus.LOCKED;
                    errorResponse.message = 'Запись заблокирована, попробуйте позже';
                    break;
                case '55P03':
                    status = HttpStatus.REQUEST_TIMEOUT;
                    errorResponse.message = 'Время ожидания для блокировки записи превышено, попробуйте позже';
                    break;
                default:
                    errorResponse.message = 'Ошибка при выполнении операции в базе';
                    break;
            }
        }

        response.status(status).json(errorResponse);
    }
}
