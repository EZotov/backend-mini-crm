import {OmitType, PickType} from '@nestjs/mapped-types';
import {ApiProperty} from '@nestjs/swagger';
import {IsString, IsUUID} from 'class-validator';

import {Deal} from '../entities/deal.entity';
import type {DealStatus} from '../types';

export class CreateDealDto extends OmitType(Deal, ['id', 'status']) {}
export class UpdateDealDto extends OmitType(Deal, ['id', 'status']) {}
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
