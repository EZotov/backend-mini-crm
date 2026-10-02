import {ApiProperty} from '@nestjs/swagger';
import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

import {User} from '~/modules/user/entities/user.entity';

import {Deal} from './deal.entity';

@Entity('deal_history')
export class DealHistory {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column({name: 'form_status'})
    fromStatus: string;

    @ApiProperty()
    @Column({name: 'to_status'})
    toStatus: string;

    @ApiProperty()
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @ManyToOne(() => Deal, (deal) => deal.history, {onDelete: 'CASCADE'})
    deal: Deal;

    @ManyToOne(() => User, {nullable: true, onDelete: 'SET NULL'})
    changedBy: User | null;
}
