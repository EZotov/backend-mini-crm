import {BadRequestException, HttpStatus, ParseUUIDPipe} from '@nestjs/common';

const uuidPipeOptions = {
    version: '4' as const,
    exceptionFactory: () => {
        return new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Bad Request',
            message: 'Переданный параметр должен быть валидным UUID v4',
        });
    },
};

/*
    Модифицированный пайп под проверку UUID-параметра
*/
export const ParseUUIDModifyPipe = new ParseUUIDPipe(uuidPipeOptions);
export const ParseUUIDModifyOptionalPipe = new ParseUUIDPipe({...uuidPipeOptions, optional: true});
