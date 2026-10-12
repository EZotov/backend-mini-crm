import {ApiProperty} from '@nestjs/swagger';
import {Exclude} from 'class-transformer';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

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

    @Exclude()
    @Column()
    password: string;

    @ApiProperty()
    @Column({name: 'first_name', nullable: true})
    firstName: string;

    @ApiProperty({required: false, nullable: true})
    @Column({type: 'varchar', nullable: true})
    patronymic: string | null;

    @ApiProperty()
    @Column({name: 'last_name', nullable: true})
    lastName: string;

    @Exclude()
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @Exclude()
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @Exclude()
    @DeleteDateColumn({nullable: true, name: 'deleted_at'})
    deletedAt: Date;

    @ApiProperty({type: () => Role, nullable: true})
    @ManyToOne(() => Role, {nullable: true, onDelete: 'SET NULL'})
    @JoinColumn({name: 'role_id'})
    role: Role | null;
}
