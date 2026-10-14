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

import {User} from '~/modules/user/entities/user.entity';

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

    @ManyToOne(() => User, {onDelete: 'SET NULL'})
    @JoinColumn({name: 'created_by'})
    createdBy: User;

    @Exclude()
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @Exclude()
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;
}
