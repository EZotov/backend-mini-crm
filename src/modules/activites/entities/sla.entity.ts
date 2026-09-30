import {Deal} from '~/modules/deal/entities/deal.entity';
import {User} from '~/modules/user/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('sla_logs')
export class SlaLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'int'})
    minutesOverdue: number; // На сколько минут затянули ответ

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @JoinColumn({name: 'deal_id'})
    @ManyToOne(() => Deal, (deal) => deal.slaLogs, {onDelete: 'CASCADE'})
    deal: Deal;

    @JoinColumn({name: 'manager_id'})
    @ManyToOne(() => User, (user) => user.slaLogs, {nullable: true, onDelete: 'SET NULL'})
    manager: User;
}
