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

import {DealDto} from '~/modules/deal/dto/deal.dto';
import {Deal} from '~/modules/deal/entities/deal.entity';

@Entity('sla_logs')
export class SlaLog {
    @ApiProperty({type: 'string', format: 'uuid'})
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({type: 'number'})
    @Column({type: 'int'})
    minutesOverdue: number;

    @ApiProperty({type: 'string', nullable: true})
    @Column({name: 'manager_id', type: 'uuid', nullable: true})
    managerId: string | null;

    @ApiProperty({type: 'string', nullable: true})
    @Column({name: 'manager_fullname', type: 'varchar', nullable: true})
    managerFullname: string | null;

    @ApiProperty()
    @Exclude()
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @ApiProperty()
    @Exclude()
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @ApiProperty({type: DealDto})
    @ManyToOne(() => Deal, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'deal_id'})
    deal: Deal;
}
