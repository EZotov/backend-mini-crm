import {ApiProperty, OmitType} from '@nestjs/swagger';
import {IsMobilePhone, IsOptional, IsString, IsUUID} from 'class-validator';

import {Customer} from '../entities/customer.entity';

export class CustomerDto extends OmitType(Customer, ['updatedAt', 'createdAt']) {}

export class CreateCustomerDto {
    @ApiProperty()
    @IsString()
    lastName: string;

    @ApiProperty({type: 'string', nullable: true, required: false})
    @IsString()
    @IsOptional()
    patronymic: string | null;

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

export class UpdateCustomerDto {
    @ApiProperty()
    @IsString()
    lastName: string;

    @ApiProperty({type: 'string', nullable: true})
    @IsString()
    @IsOptional()
    patronymic: string | null;

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
