import {ApiProperty} from '@nestjs/swagger';
import {Deal} from '~/modules/deal/entities/deal.entity';
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

import {Company} from './company.entity';

@Entity({name: 'customers'})
export class Customer {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column({name: 'full_title'})
    fullTitle: string;

    @ApiProperty()
    @Column({name: 'short_title', nullable: true})
    shortTitle: string;

    @ApiProperty({required: true})
    @Column({unique: true})
    phone: string;

    @ApiProperty()
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @Exclude()
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @Exclude()
    @OneToMany(() => Deal, (deal) => deal.customer)
    deals: Deal[];

    @JoinColumn({name: 'company_id'})
    @ManyToOne(() => Company, (company) => company.contacts)
    company: Company;
}
