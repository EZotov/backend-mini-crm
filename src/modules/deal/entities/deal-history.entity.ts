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

import {User} from '~/modules/user/entities/user.entity';

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

    @ApiProperty()
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @Exclude()
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @ApiProperty()
    @ManyToOne(() => Deal, (deal) => deal.history, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'deal_id'})
    deal: Deal;

    @ApiProperty({nullable: true})
    @ManyToOne(() => User, {nullable: true, onDelete: 'SET NULL'})
    @JoinColumn({name: 'manager_id'})
    changedBy: User | null;
}
