import {ApiProperty} from '@nestjs/swagger';
import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';

import {Deal} from './deal.entity';

@Entity('deal_history')
export class DealHistory {
    @ApiProperty({type: 'string', format: 'uuid'})
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column({name: 'action_description', type: 'varchar'})
    actionDescription: string;

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
