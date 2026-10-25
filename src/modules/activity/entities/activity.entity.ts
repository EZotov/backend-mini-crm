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

import {ACTIVITY_ENUM, ACTIVITY_STATUS, ACTIVITY_STATUS_ENUM} from '../consts';
import type {ActivityStatus, ActivityType} from '../types';

@Entity('activities')
export class Activity {
    @ApiProperty({type: 'string', format: 'uuid'})
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({enum: ACTIVITY_ENUM})
    @Column({enum: ACTIVITY_ENUM})
    type: ActivityType;

    @ApiProperty()
    @Column({type: 'varchar'})
    title: string;

    @ApiProperty()
    @Column()
    description: string;

    @ApiProperty({type: 'string', format: 'date-time'})
    @Column({type: 'timestamp'})
    dueDate: Date;

    @ApiProperty({enum: ACTIVITY_STATUS_ENUM})
    @Column({type: 'enum', enum: ACTIVITY_STATUS_ENUM, default: ACTIVITY_STATUS.NEW})
    status: ActivityStatus;

    @Exclude()
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @Exclude()
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @ApiProperty({type: DealDto})
    @Type(() => DealDto)
    @ManyToOne(() => Deal, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'deal_id'})
    deal: Deal;

    // На кого назначена
    @ApiProperty({type: UserDto, nullable: true})
    @Type(() => UserDto)
    @OneToOne(() => User, {onDelete: 'SET NULL'})
    @JoinColumn({name: 'assigned_id'})
    assigned: User | null;

    // Тот кто создал
    @ApiProperty({type: UserDto})
    @Type(() => UserDto)
    @OneToOne(() => User, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'created_by_id'})
    createdBy: User;
}
