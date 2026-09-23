import {ApiProperty} from '@nestjs/swagger';
import {Exclude} from 'class-transformer';
import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

import {Deal} from '../../deal/deal.entity';

@Entity({name: 'customers'})
export class Customer {
    @ApiProperty({required: true})
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({required: true})
    @Column({name: 'full_title'})
    fullTitle: string;

    @ApiProperty({required: true})
    @Column({name: 'short_title', nullable: true})
    shortTitle: string;

    @ApiProperty({required: true})
    @Column({unique: true})
    phone: string;

    @ApiProperty({required: true})
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @Exclude()
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @Exclude()
    @OneToMany(() => Deal, (deal) => deal.customer)
    deals: Deal[];
}
