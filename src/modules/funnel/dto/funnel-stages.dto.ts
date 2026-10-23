import {Column, PrimaryGeneratedColumn} from 'typeorm';

import {FUNNEL_STAGE_TYPE_ENUM} from '~/modules/deal/consts';
import type {FunnelStageType} from '~/modules/deal/types';

export class FunnelStagesDto {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar'})
    title: string;

    @Column({type: 'int'})
    order: number;

    @Column({type: 'varchar', enum: FUNNEL_STAGE_TYPE_ENUM})
    type: FunnelStageType;
}
