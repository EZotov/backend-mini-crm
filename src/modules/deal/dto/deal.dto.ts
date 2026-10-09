import {ApiProperty} from '@nestjs/swagger';
import {Type} from 'class-transformer';
import {IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID} from 'class-validator';

import {CustomerDto} from '~/modules/customer/dto/customer.dto';
import {UserDto} from '~/modules/user/dto/user.dto';

import {DEAL_STATUS_ENUM} from '../consts';
import type {DealStatus} from '../types';

export class CreateDealDto {
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

    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty({type: 'number'})
    @IsNumber()
    budget: number;

    @ApiProperty({type: 'string', format: 'date-time'})
    @IsString()
    slaDeadline: string;

    @ApiProperty({type: 'boolean'})
    @IsBoolean()
    isSlaViolated: boolean;
}

export class DealDto {
    @ApiProperty({example: 'd3b07384-d113-4956-a5e2-aa59df3a8d9a', description: 'ID сделки'})
    id: string;

    @ApiProperty({example: 'Контракт на поставку', description: 'Название сделки'})
    title: string;

    @ApiProperty({example: 150000, description: 'Бюджет сделки'})
    budget: number;

    @ApiProperty({enum: DEAL_STATUS_ENUM, description: 'Статус сделки'})
    status: DealStatus;

    @ApiProperty({example: '2026-10-15T12:00:00.000Z', description: 'Дедлайн SLA', required: false})
    slaDeadline: Date;

    @ApiProperty({example: false, description: 'Нарушен ли SLA'})
    isSlaViolated: boolean;

    @ApiProperty({type: () => UserDto, description: 'Менеджер сделки'})
    @Type(() => UserDto)
    manager: UserDto;

    @ApiProperty({type: () => CustomerDto, description: 'Клиент сделки'})
    @Type(() => CustomerDto)
    customer: CustomerDto;
}

export class ChangeStatusDealDto {
    @ApiProperty({
        enum: DEAL_STATUS_ENUM,
        example: 'IN_PROGRESS',
        description: 'Новый статус сделки',
    })
    @IsEnum(DEAL_STATUS_ENUM)
    @IsNotEmpty()
    status: DealStatus;
}

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
