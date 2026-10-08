import {ApiProperty, OmitType, PickType} from '@nestjs/swagger';
import {Type} from 'class-transformer';
import {IsNotEmpty, IsOptional, IsString, IsUUID} from 'class-validator';

import {CustomerDto} from '~/modules/customer/dto/customer.dto';
import {UserDto} from '~/modules/user/dto/user.dto';

import {Deal} from '../entities/deal.entity';
import type {DealStatus} from '../types';

export class CreateDealDto extends OmitType(Deal, [
    'id',
    'status',
    'manager',
    'company',
    'customer',
    'updatedAt',
    'createdAt',
]) {
    @ApiProperty({
        example: 'd3b07384-d113-4956-a5e2-aa59df3a8d9a',
        description: 'UUID менеджера (User)',
    })
    @IsUUID()
    @IsNotEmpty()
    managerId: string;

    @ApiProperty({
        example: 'e4f08384-c224-4956-b6f3-bb59df3a8d9b',
        description: 'UUID компании',
        required: false,
    })
    @IsUUID()
    @IsOptional()
    companyId?: string;

    @ApiProperty({
        example: 'a1b07384-f334-4956-c7d4-cc59df3a8d9c',
        description: 'UUID клиента (Customer)',
    })
    @IsUUID()
    @IsNotEmpty()
    customerId: string;
}
export class DealDto extends OmitType(Deal, ['createdAt', 'updatedAt', 'manager', 'customer']) {
    @ApiProperty({type: () => UserDto})
    @Type(() => UserDto)
    manager: UserDto;

    @ApiProperty({type: () => CustomerDto})
    @Type(() => CustomerDto)
    customer: CustomerDto;
}

export class UpdateDealDto extends CreateDealDto {}
export class ChangeStatusDealDto extends PickType(Deal, ['status']) {}

export class CreateSLALogDto {
    @ApiProperty()
    @IsUUID('4')
    dealId: string;

    @ApiProperty()
    @IsUUID('4')
    managerId: string;

    @ApiProperty()
    @IsString()
    fromStatus: DealStatus;

    @ApiProperty()
    @IsString()
    toStatus: DealStatus;
}
