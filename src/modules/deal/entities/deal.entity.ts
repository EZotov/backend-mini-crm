import {Activity} from '~/modules/activites/entities/activites.entity';
import {SlaLog} from '~/modules/activites/entities/sla.entity';
import {Company} from '~/modules/customer/entities/company.entity';
import {Customer} from '~/modules/customer/entities/customer.entity';
import {User} from '~/modules/user/entities/user.entity';
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

import {DealHistory} from './deal-history.entity';

@Entity({name: 'deals'})
export class Deal {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    budget: number;

    @Column({enum: ['NEW', 'IN_PROGRESS', 'INVOICE', 'WON', 'LOST']})
    status: string;

    @Column({name: 'sla_deadline', type: 'timestamp', nullable: true})
    slaDeadline: Date;

    @Column({default: false})
    isSlaViolated: boolean;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.deals)
    @JoinColumn({name: 'manager_id'})
    manager: User;

    @ManyToOne(() => Company, (company) => company.deals)
    company: Company;

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
