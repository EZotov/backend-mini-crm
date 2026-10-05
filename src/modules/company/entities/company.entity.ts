import {ApiProperty} from '@nestjs/swagger';
import {Exclude} from 'class-transformer';
import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

import {Deal} from '~/modules/deal/entities/deal.entity';

import {Customer} from '../../customer/entities/customer.entity';

@Entity({name: 'company'})
export class Company {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column({name: 'full_title'})
    fullTitle: string;

    @ApiProperty()
    @Column({name: 'short_title', nullable: true})
    shortTitle: string;

    @ApiProperty()
    @Column({nullable: true})
    inn: string;

    @Exclude()
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @Exclude()
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @OneToMany(() => Deal, (deal) => deal.company)
    deals: Deal[];

    @OneToMany(() => Customer, (customer) => customer.company)
    contacts: Customer[];
}
