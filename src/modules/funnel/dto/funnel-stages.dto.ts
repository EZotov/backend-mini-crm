import {ApiProperty} from '@nestjs/swagger';
import {Expose, Transform} from 'class-transformer';
import {IsNumber, IsString, IsUUID} from 'class-validator';

import {FUNNEL_STAGE_TYPE_ENUM} from '~/modules/deal/consts';
import type {FunnelStageType} from '~/modules/deal/types';

export class CreateFunnelStagesDto {
    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty({type: 'string', enum: FUNNEL_STAGE_TYPE_ENUM})
    @IsString()
    type: FunnelStageType;

    @ApiProperty({type: 'string', format: 'uuid'})
    @IsUUID()
    funnelId: string;
}

export class UpdateFunnelStagesDto {
    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty({type: 'string', enum: FUNNEL_STAGE_TYPE_ENUM})
    @IsString()
    type: FunnelStageType;

    @ApiProperty({type: 'string', format: 'uuid'})
    @IsUUID()
    funnelId: string;
}

export class ChangeOrderFunnelStagesDto {
    @ApiProperty({type: 'string', format: 'uuid'})
    @IsUUID()
    funnelId: string;

    @ApiProperty({type: 'number'})
    @IsNumber()
    sourceIndex: number;

    @ApiProperty({type: 'number'})
    @IsNumber()
    targetIndex: number;
}

export class FunnelStagesDto {
    @ApiProperty({type: 'string', format: 'uuid'})
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    title: string;

    @ApiProperty({type: 'number'})
    @Expose()
    order: number;

    @ApiProperty({type: 'string', enum: FUNNEL_STAGE_TYPE_ENUM})
    @Expose()
    type: FunnelStageType;

    @ApiProperty({type: 'string', nullable: true})
    @Transform(({obj}) => obj?.funnel?.title ?? null)
    @Expose()
    funnelTitle: string | null;
}
