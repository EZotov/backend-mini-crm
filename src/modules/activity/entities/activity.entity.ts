import {ApiProperty} from '@nestjs/swagger';
import {Exclude, Type} from 'class-transformer';
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

import {DealDto} from '~/modules/deal/dto/deal.dto';
import {Deal} from '~/modules/deal/entities/deal.entity';
import {UserDto} from '~/modules/user/dto/user.dto';
import {User} from '~/modules/user/entities/user.entity';

import {ACTIVITY_ENUM} from '../consts';
import type {ActivityType} from '../types';

@Entity('activities')
export class Activity {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({enum: ACTIVITY_ENUM})
    @Column({enum: ACTIVITY_ENUM})
    type: ActivityType;

    @ApiProperty()
    @Column()
    description: string;

    @ApiProperty()
    @Column({type: 'timestamp'})
    dueDate: Date; // Дедлайн выполнения задачи

    @ApiProperty({type: 'boolean'})
    @Column({type: 'boolean', default: false})
    isCompleted: boolean;

    @Exclude()
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @Exclude()
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @ApiProperty({type: DealDto})
    @Type(() => DealDto)
    @ManyToOne(() => Deal, (deal) => deal.activities, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'deal_id'})
    deal: Deal;

    @ApiProperty({type: UserDto})
    @Type(() => UserDto)
    @OneToOne(() => User, (user) => user.activities, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'manager_id'})
    manager: User; // Ответственный за задачу менеджер
}
