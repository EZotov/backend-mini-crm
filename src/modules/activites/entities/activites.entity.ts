import {ApiProperty} from '@nestjs/swagger';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import {Deal} from '~/modules/deal/entities/deal.entity';
import {User} from '~/modules/user/entities/user.entity';

import {ACTIVITY_ENUM} from '../consts';
import type {ActivityType} from '../types';

@Entity('activities')
export class Activity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({enum: ACTIVITY_ENUM})
    @Column({enum: ACTIVITY_ENUM})
    type: ActivityType;

    @Column()
    description: string;

    @Column({type: 'timestamp'})
    dueDate: Date; // Дедлайн выполнения задачи

    @Column({type: 'boolean', default: false})
    isCompleted: boolean;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @ManyToOne(() => Deal, (deal) => deal.activities, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'deal_id'})
    deal: Deal;

    @OneToOne(() => User, (user) => user.activities, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'manager_id'})
    manager: User; // Ответственный за задачу менеджер
}
