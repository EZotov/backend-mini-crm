import {ApiProperty} from '@nestjs/swagger';
import {Deal} from '~/modules/deal/entities/deal.entity';
import {Exclude} from 'class-transformer';
import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

import {Customer} from './customer.entity';

@Entity({name: 'company'})
export class Company {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column()
    name: string; // Например, "ООО Вектор"

    @ApiProperty()
    @Column({nullable: true})
    inn: string; // ИНН для B2B-проверок

    @CreateDateColumn()
    createdAt: Date;

    @Exclude()
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @OneToMany(() => Deal, (deal) => deal.company)
    deals: Deal[];

    @OneToMany(() => Customer, (customer) => customer.company)
    contacts: Customer[];
}
