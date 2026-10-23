import {ApiProperty} from '@nestjs/swagger';
import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';

import {DEAL_STATUS_ENUM} from '../consts';
import type {DealStatus} from '../types';
import {Deal} from './deal.entity';

@Entity('deal_history')
export class DealHistory {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({enum: DEAL_STATUS_ENUM})
    @Column({name: 'form_status', enum: DEAL_STATUS_ENUM})
    fromStatus: DealStatus;

    @ApiProperty({enum: DEAL_STATUS_ENUM})
    @Column({name: 'to_status', enum: DEAL_STATUS_ENUM})
    toStatus: DealStatus;

    @ApiProperty({type: 'string', nullable: true})
    @Column({name: 'changed_by_id', type: 'uuid', nullable: true})
    changedById: string | null;

    @ApiProperty({type: 'string', nullable: true})
    @Column({name: 'changed_by_fullname', type: 'varchar', nullable: true})
    changedByFullname: string | null;

    @ApiProperty()
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @ApiProperty()
    @ManyToOne(() => Deal, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'deal_id'})
    deal: Deal;
}
