import {Column, Entity, Index, JoinColumn, ManyToOne} from 'typeorm';

import {BaseEntity} from '@dto/entity.dto';
import {FUNNEL_STAGE_TYPE_ENUM} from '~/modules/deal/consts';
import type {FunnelStageType} from '~/modules/deal/types';

import {Funnel} from './funnel.entity';

@Entity('funnel_stages')
@Index('UQ_FUNNEL_STAGE_ORDER', ['funnel', 'order'], {unique: true})
export class FunnelStage extends BaseEntity {
    @Column({type: 'varchar'})
    title: string;

    @Column({type: 'int'})
    order: number;

    @Column({type: 'varchar', enum: FUNNEL_STAGE_TYPE_ENUM})
    type: FunnelStageType;

    @ManyToOne(() => Funnel, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'funnel_id'})
    funnel: Funnel;
}
