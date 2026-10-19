import {ApiProperty} from '@nestjs/swagger';
import {IsArray, IsNumber, IsOptional, IsString} from 'class-validator';

export class PaginationDto {
    @ApiProperty()
    @IsNumber()
    pageNum: number;

    @ApiProperty()
    @IsNumber()
    pageSize: number;
}

export class CreateResponseDto {
    constructor(partial: Partial<CreateResponseDto>) {
        Object.assign(this, partial);
    }

    @ApiProperty()
    @IsString()
    id: string;
}

export class ResponseDto<T> {
    constructor(partial: Partial<ResponseDto<T>>) {
        Object.assign(this, partial);
    }

    @ApiProperty()
    data: T;
}

export class CollectionResponseDto<T> {
    constructor(partial: Partial<CollectionResponseDto<T>>) {
        Object.assign(this, partial);
    }

    @ApiProperty()
    @IsArray()
    data: T[];

    @ApiProperty()
    @IsNumber()
    total: number;
}

export class GetRequestBaseQuery extends PaginationDto {
    @ApiProperty({required: false, example: 'title'})
    @IsString()
    @IsOptional()
    sortedBy?: string;

    @ApiProperty({required: false, example: 'ASC'})
    @IsString()
    @IsOptional()
    sortDirection?: 'ASC' | 'DESC';
}
