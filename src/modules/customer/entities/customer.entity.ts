import {ApiProperty} from '@nestjs/swagger';
import {Exclude} from 'class-transformer';
import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

import {Deal} from '../../deal/deal.entity';

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
}
