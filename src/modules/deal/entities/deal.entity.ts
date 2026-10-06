import {ApiProperty} from '@nestjs/swagger';
import {Exclude} from 'class-transformer';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import {Activity} from '~/modules/activites/entities/activites.entity';
import {SlaLog} from '~/modules/activites/entities/sla.entity';
import {Company} from '~/modules/company/entities/company.entity';
import {Customer} from '~/modules/customer/entities/customer.entity';
import {User} from '~/modules/user/entities/user.entity';

import {DEAL_STATUS, DEAL_STATUS_ENUM} from '../consts';
import type {DealStatus} from '../types';
import {DealHistory} from './deal-history.entity';

@Entity({name: 'deals'})
export class Deal {
    @ApiProperty()
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

    @ApiProperty()
    @Column({name: 'sla_deadline', type: 'timestamp', nullable: true})
    slaDeadline: Date;

    @ApiProperty()
    @Column({name: 'is_sla_violated', default: false, type: 'boolean'})
    isSlaViolated: boolean;

    @Exclude()
    @ApiProperty()
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @Exclude()
    @ApiProperty()
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @ApiProperty({type: () => User})
    @ManyToOne(() => User, (user) => user.deals)
    @JoinColumn({name: 'manager_id'})
    manager: User;

    @ApiProperty({type: () => Company})
    @ManyToOne(() => Company, (company) => company.deals)
    @JoinColumn({name: 'company_id'})
    company: Company;

    @ApiProperty({type: () => Customer})
    @ManyToOne(() => Customer, (customer) => customer.deals)
    @JoinColumn({name: 'customer_id'})
    customer: Customer;

    @OneToMany(() => Activity, (activities) => activities.deal)
    activities: Activity[];

    @OneToMany(() => DealHistory, (dealHistory) => dealHistory.deal)
    history: DealHistory[];

    @OneToMany(() => SlaLog, (logs) => logs.deal)
    slaLogs: SlaLog[];
}
