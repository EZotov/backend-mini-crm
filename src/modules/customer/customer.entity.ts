import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

import {Deal} from '../deal/deal.entity';

@Entity({name: 'customers'})
export class Customer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({name: 'full_title'})
    fullTitle: string;

    @Column({name: 'short_title', nullable: true})
    shortTitle: string;

    @Column({unique: true})
    phone: string;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @OneToMany(() => Deal, (deal) => deal.customer)
    deals: Deal[];
}
