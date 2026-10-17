import {ApiProperty, OmitType} from '@nestjs/swagger';
import {IsMobilePhone, IsString, IsUUID} from 'class-validator';

import {Customer} from '../entities/customer.entity';

export class CustomerDto extends OmitType(Customer, ['updatedAt', 'createdAt', 'company']) {}

export class CreateOrUpdateCustomerDto {
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

    @ApiProperty()
    @IsUUID()
    companyId: string;
}
