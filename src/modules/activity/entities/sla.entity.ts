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
import {UserDto} from '~/modules/user/dto/user.dto';
import {User} from '~/modules/user/entities/user.entity';

@Entity('sla_logs')
export class SlaLog {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({type: 'number'})
    @Column({type: 'int'})
    minutesOverdue: number;

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

    @ApiProperty({type: UserDto, nullable: true})
    @ManyToOne(() => User, {nullable: true, onDelete: 'SET NULL'})
    @JoinColumn({name: 'manager_id'})
    manager: User | null;
}
