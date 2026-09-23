import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import {Customer} from '../customer/entities/customer.entity';
import {User} from '../user/user.entity';

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

    @ManyToOne(() => Customer, (customer) => customer.deals)
    @JoinColumn({name: 'customer_id'})
    customer: Customer;
}
