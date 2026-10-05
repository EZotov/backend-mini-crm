import {ApiProperty} from '@nestjs/swagger';
import {IsNumber, IsString} from 'class-validator';

import {CodeType} from '@interfaces/errors.interface';

export class PaginationDto {
    @ApiProperty()
    @IsNumber()
    pageNum: number;

    @ApiProperty()
    @IsNumber()
    pageSize: number;
}

export class CreateResponseDto {
    @ApiProperty()
    @IsString()
    id: string;
}

export class ResponseDto<T> {
    @ApiProperty()
    data: T;
}

export class CollectionResponseDto<T> {
    @ApiProperty()
    data: T[];

    @ApiProperty()
    @IsNumber()
    total: number;
}

export class ErrorResponseDto {
    @ApiProperty()
    code: CodeType | null;

    @ApiProperty()
    message: string | null;
}
