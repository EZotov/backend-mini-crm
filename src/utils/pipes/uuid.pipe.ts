import {BadRequestException, ParseUUIDPipe} from '@nestjs/common';

const uuidPipeOptions = {
    version: '4' as const,
    exceptionFactory: () => new BadRequestException('Переданный параметр должен быть валидным UUID v4'),
};

/*
    Модифицированный пайп под проверку UUID-параметра
*/
export const ParseUUIDModifyPipe = new ParseUUIDPipe(uuidPipeOptions);
export const ParseUUIDModifyOptionalPipe = new ParseUUIDPipe({...uuidPipeOptions, optional: true});
