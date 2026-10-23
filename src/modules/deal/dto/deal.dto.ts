import {ApiProperty, OmitType} from '@nestjs/swagger';
import {Expose, Type} from 'class-transformer';
import {IsEnum, IsNotEmpty, IsNumber, IsString, IsUUID} from 'class-validator';

import {CustomerDto} from '~/modules/customer/dto/customer.dto';
import {FunnelStagesDto} from '~/modules/funnel/dto/funnel-stages.dto';
import {Funnel} from '~/modules/funnel/entities/funnel.entity';
import {UserDto} from '~/modules/user/dto/user.dto';

import {DEAL_STATUS_ENUM} from '../consts';
import type {DealStatus} from '../types';

export class CreateOrUpdateDealDto {
    @ApiProperty({
        example: 'd3b07384-d113-4956-a5e2-aa59df3a8d9a',
        description: 'UUID менеджера (User)',
    })
    @IsUUID()
    @IsNotEmpty()
    managerId: string;

    @ApiProperty({
        example: 'a1b07384-f334-4956-c7d4-cc59df3a8d9c',
        description: 'UUID клиента (Customer)',
    })
    @IsUUID()
    @IsNotEmpty()
    customerId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({type: 'number'})
    @IsNotEmpty()
    @IsNumber()
    budget: number;
}

export class DealDto {
    @ApiProperty({
        type: 'string',
        format: 'uuid',
        example: 'd3b07384-d113-4956-a5e2-aa59df3a8d9a',
        description: 'ID сделки',
    })
    @Expose()
    id: string;

    @ApiProperty({example: 'Контракт на поставку', description: 'Название сделки'})
    @Expose()
    title: string;

    @ApiProperty({example: 150000, description: 'Бюджет сделки'})
    @Expose()
    budget: number;

    @ApiProperty({enum: DEAL_STATUS_ENUM, description: 'Статус сделки'})
    @Expose()
    status: DealStatus;

    @ApiProperty({example: '2026-10-15T12:00:00.000Z', description: 'Дедлайн SLA', required: false})
    @Expose()
    slaDeadline: Date;

    @ApiProperty({example: false, description: 'Нарушен ли SLA'})
    @Expose()
    isSlaViolated: boolean;

    @ApiProperty({type: () => UserDto, description: 'Менеджер сделки'})
    @Expose()
    @Type(() => UserDto)
    manager: UserDto;

    @ApiProperty({type: () => UserDto, description: 'Автор сделки'})
    @Expose()
    @Type(() => UserDto)
    createdBy: UserDto;

    @ApiProperty({type: () => CustomerDto, description: 'Клиент сделки'})
    @Expose()
    @Type(() => CustomerDto)
    customer: CustomerDto;

    @ApiProperty({type: () => Funnel, description: 'Воронка'})
    @Expose()
    funnel: Funnel;

    @ApiProperty({type: () => FunnelStagesDto, description: 'Этап воронки'})
    @Expose()
    @Type(() => FunnelStagesDto)
    currentFunnelStage: FunnelStagesDto;
}

export class DealShortDto extends OmitType(DealDto, ['createdBy']) {}

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

export class ChangeDealFunnelStage {
    @ApiProperty({
        example: 'a1b07384-f334-4956-c7d4-cc59df3a8d9c',
        description: 'UUID этапа воронки',
    })
    @IsUUID('4')
    @IsNotEmpty()
    currentFunnelStage: string;
}

export class CreateDealHistoryLogDto {
    @ApiProperty()
    @IsUUID('4')
    dealId: string;

    @ApiProperty()
    @IsUUID('4')
    changedById: string;

    @ApiProperty()
    @IsString()
    changedByFullname: string;

    @ApiProperty()
    @IsString()
    actionDescription: string;
}
