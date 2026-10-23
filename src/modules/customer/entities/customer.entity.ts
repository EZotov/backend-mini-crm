import {ApiProperty} from '@nestjs/swagger';
import {Exclude, Expose} from 'class-transformer';
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
    @ApiProperty({type: 'string', format: 'uuid'})
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Expose()
    @Column({name: 'last_name'})
    lastName: string;

    @ApiProperty({nullable: true})
    @Expose()
    @Column({type: 'varchar', nullable: true})
    patronymic: string | null;

    @ApiProperty()
    @Expose()
    @Column({name: 'first_name'})
    firstName: string;

    @ApiProperty()
    @Expose()
    @Column({unique: true})
    phone: string;

    @Exclude()
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @Exclude()
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @ApiProperty({type: Company})
    @Expose()
    @ManyToOne(() => Company)
    @JoinColumn({name: 'company_id'})
    company: Company;
}
