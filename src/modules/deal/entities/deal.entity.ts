import {ApiProperty} from '@nestjs/swagger';
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
import {Company} from '~/modules/customer/entities/company.entity';
import {Customer} from '~/modules/customer/entities/customer.entity';
import {User} from '~/modules/user/entities/user.entity';

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
    @Column()
    budget: number;

    @ApiProperty()
    @Column({enum: ['NEW', 'IN_PROGRESS', 'INVOICE', 'WON', 'LOST']})
    status: string;

    @ApiProperty()
    @Column({name: 'sla_deadline', type: 'timestamp', nullable: true})
    slaDeadline: Date;

    @ApiProperty()
    @Column({name: 'is_sla_violated', default: false})
    isSlaViolated: boolean;

    @ApiProperty()
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @ApiProperty()
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @ApiProperty({type: User})
    @ManyToOne(() => User, (user) => user.deals)
    @JoinColumn({name: 'manager_id'})
    manager: User;

    @ApiProperty({type: Company})
    @ManyToOne(() => Company, (company) => company.deals)
    @JoinColumn({name: 'company_id'})
    company: Company;

    @ApiProperty({type: Customer})
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
