import {ApiProperty, OmitType} from '@nestjs/swagger';
import {IsMobilePhone, IsOptional, IsString, IsUUID} from 'class-validator';

import {Customer} from '../entities/customer.entity';

export class CustomerDto extends OmitType(Customer, ['updatedAt', 'createdAt']) {}

export class CreateOrUpdateCustomerDto {
    @ApiProperty()
    @IsString()
    lastName: string;

    @ApiProperty({required: false, nullable: true})
    @IsString()
    @IsOptional()
    patronymic?: string | null;

    @ApiProperty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsString()
    @IsMobilePhone('ru-RU', {}, {message: 'Некорректный формат номера телефона'})
    phone: string;

    @ApiProperty()
    @IsUUID()
    companyId: string;
}
