import {ApiProperty} from '@nestjs/swagger';
import {Exclude} from 'class-transformer';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import {Company} from '../../company/entities/company.entity';

@Entity({name: 'customers'})
export class Customer {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column({name: 'last_name'})
    lastName: string;

    @ApiProperty({nullable: true})
    @Column({nullable: true})
    patronymic: string;

    @ApiProperty()
    @Column({name: 'first_name'})
    firstName: string;

    @ApiProperty()
    @Column({unique: true})
    phone: string;

    @Exclude()
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @Exclude()
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @ManyToOne(() => Company)
    @JoinColumn({name: 'company_id'})
    company: Company;
}
