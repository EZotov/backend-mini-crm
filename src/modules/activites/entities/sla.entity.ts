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

    @ManyToOne(() => Deal, (deal) => deal.slaLogs, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'deal_id'})
    deal: Deal;

    @ManyToOne(() => User, (user) => user.slaLogs, {nullable: true, onDelete: 'SET NULL'})
    @JoinColumn({name: 'manager_id'})
    manager: User | null;
}
