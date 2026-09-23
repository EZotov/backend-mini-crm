import {ApiProperty} from '@nestjs/swagger';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import {Deal} from '../../deal/deal.entity';
import {Role} from './role.entity';

@Entity({name: 'users'})
@Index('USER_EMAIL_ACTIVE', ['email'], {unique: true, where: '"deleted_at" IS NULL'})
export class User {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column()
    email: string;

    @Column()
    password: string;

    @ApiProperty()
    @Column({name: 'first_name'})
    firstName: string;

    @ApiProperty()
    @Column()
    patronymic: string;

    @ApiProperty()
    @Column({name: 'last_name'})
    lastName: string;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @DeleteDateColumn({nullable: true, name: 'deleted_at'})
    deletedAt: Date;

    @ApiProperty({type: Role})
    @OneToOne(() => Role, (role) => role.user, {nullable: true, onDelete: 'SET NULL'})
    @JoinColumn({name: 'role_id'})
    role: Role;

    @OneToMany(() => Deal, (deal) => deal.manager)
    deals: Deal[];
}
