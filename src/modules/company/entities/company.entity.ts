import {ApiProperty} from '@nestjs/swagger';
import {Exclude, Expose} from 'class-transformer';
import {IsString} from 'class-validator';
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
    @ApiProperty({type: 'string', format: 'uuid'})
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @IsString()
    @Expose()
    @Column({name: 'full_title'})
    fullTitle: string;

    @ApiProperty()
    @IsString()
    @Expose()
    @Column({name: 'short_title', nullable: true})
    shortTitle: string;

    @ApiProperty()
    @IsString()
    @Expose()
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
