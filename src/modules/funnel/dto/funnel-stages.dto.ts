import {ApiProperty} from '@nestjs/swagger';
import {Expose} from 'class-transformer';

import {FUNNEL_STAGE_TYPE_ENUM} from '~/modules/deal/consts';
import type {FunnelStageType} from '~/modules/deal/types';

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
}
