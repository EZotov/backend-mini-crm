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

import {Deal} from '../deal/deal.entity';
import {Role} from './role.entity';

@Entity({name: 'users'})
@Index('USER_EMAIL_ACTIVE', ['email'], {unique: true, where: '"deleted_at" IS NULL'})
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({name: 'first_name'})
    firstName: string;

    @Column()
    patronymic: string;

    @Column({name: 'last_name'})
    lastName: string;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @DeleteDateColumn({nullable: true, name: 'deleted_at'})
    deletedAt: Date;

    @OneToOne(() => Role, (role) => role.user, {nullable: true, onDelete: 'SET NULL'})
    @JoinColumn({name: 'role_id'})
    role: Role;

    @OneToMany(() => Deal, (deal) => deal.manager)
    deals: Deal[];
}
