import {ApiProperty, OmitType} from '@nestjs/swagger';
import {IsMobilePhone, IsNumber, IsString} from 'class-validator';

import {Customer} from '../entities/customer.entity';

export class PaginationParams {
    @ApiProperty()
    @IsNumber()
    pageSize: number;

    @ApiProperty()
    @IsNumber()
    pageNum: number;
}

export class CustomerDto extends OmitType(Customer, ['updatedAt', 'deals']) {}

export class CustomerAllDto {
    @ApiProperty({type: CustomerDto, isArray: true})
    data: Customer[];

    @ApiProperty()
    total: number;
}

export class CreateCustomerDto {
    @ApiProperty()
    @IsString()
    fullTitle: string;

    @ApiProperty()
    @IsString()
    shortTitle: string;

    @ApiProperty()
    @IsString()
    @IsMobilePhone('ru-RU', {}, {message: 'Некорректный формат номера телефона'})
    phone: string;
}

export class IdResponseDto {
    @ApiProperty()
    @IsString()
    id: string;
}
