import {User} from '~/modules/user/entities/user.entity';
import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

import {Deal} from './deal.entity';

@Entity('deal_history')
export class DealHistory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({name: 'form_status'})
    fromStatus: string;

    @Column({name: 'to_status'})
    toStatus: string;

    @ManyToOne(() => User, {nullable: true, onDelete: 'SET NULL'})
    changedBy: User | null; // Кто передвинул карточку

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @ManyToOne(() => Deal, (deal) => deal.history, {onDelete: 'CASCADE'})
    deal: Deal;
}
