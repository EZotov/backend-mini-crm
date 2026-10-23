import {Exclude} from 'class-transformer';
import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import {FUNNEL_STAGE_TYPE_ENUM} from '~/modules/deal/consts';
import type {FunnelStageType} from '~/modules/deal/types';

import {Funnel} from './funnel.entity';

@Entity('funnel_stages')
@Index('UQ_FUNNEL_STAGE_ORDER', ['funnel', 'order'], {unique: true})
export class FunnelStages {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar'})
    title: string;

    @Column({type: 'int'})
    order: number;

    @Column({type: 'varchar', enum: FUNNEL_STAGE_TYPE_ENUM})
    type: FunnelStageType;

    @Exclude()
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @Exclude()
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @ManyToOne(() => Funnel, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'funnel_id'})
    funnel: Funnel;
}
