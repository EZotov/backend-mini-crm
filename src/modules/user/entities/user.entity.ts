import {ApiProperty} from '@nestjs/swagger';
import {Activity} from '~/modules/activites/entities/activites.entity';
import {Deal} from '~/modules/deal/entities/deal.entity';
import {Exclude} from 'class-transformer';
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

    @ApiProperty()
    @Column({nullable: true})
    patronymic: string;

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

    @ApiProperty({type: Role})
    @OneToOne(() => Role, (role) => role.user, {nullable: true, onDelete: 'SET NULL'})
    @JoinColumn({name: 'role_id'})
    role: Role;

    @OneToMany(() => Deal, (deal) => deal.manager)
    deals: Deal[];

    @OneToMany(() => Activity, (activities) => activities.manager)
    activities: Activity[];
}
