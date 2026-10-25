import {ApiProperty} from '@nestjs/swagger';
import {Exclude} from 'class-transformer';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import {Customer} from '~/modules/customer/entities/customer.entity';
import {FunnelStage} from '~/modules/funnel/entities/funnel-stages.entity';
import {User} from '~/modules/user/entities/user.entity';

import {DEAL_STATUS, DEAL_STATUS_ENUM} from '../consts';
import type {DealStatus} from '../types';

@Entity({name: 'deals'})
export class Deal {
    @ApiProperty({type: 'string', format: 'uuid'})
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column()
    title: string;

    @ApiProperty()
    @Column({type: 'numeric'})
    budget: number;

    @ApiProperty({enum: DEAL_STATUS_ENUM})
    @Column({enum: DEAL_STATUS_ENUM, default: DEAL_STATUS.NEW})
    status: DealStatus;

    @ApiProperty({example: '2026-10-14T13:45:00.000Z'})
    @Column({name: 'sla_deadline', type: 'timestamptz'})
    slaDeadline: Date;

    @ApiProperty()
    @Column({name: 'is_sla_violated', default: false, type: 'boolean'})
    isSlaViolated: boolean;

    @Exclude()
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @Exclude()
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @ApiProperty({type: () => User})
    @ManyToOne(() => User)
    @JoinColumn({name: 'manager_id'})
    manager: User;

    @ApiProperty({type: () => User})
    @ManyToOne(() => User)
    @JoinColumn({name: 'created_by_id'})
    createdBy: User;

    @ApiProperty({type: () => Customer})
    @ManyToOne(() => Customer)
    @JoinColumn({name: 'customer_id'})
    customer: Customer;

    @ApiProperty({type: () => FunnelStage})
    @ManyToOne(() => FunnelStage, {onDelete: 'SET NULL'})
    @JoinColumn({name: 'funnel_stage_id'})
    currentFunnelStage: FunnelStage;
}
