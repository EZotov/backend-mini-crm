import {ApiProperty} from '@nestjs/swagger';
import {Exclude} from 'class-transformer';
import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

@Entity('funnels')
export class Funnel {
    @ApiProperty({type: 'string', format: 'uuid'})
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column({type: 'varchar'})
    title: string;

    @ApiProperty({type: 'boolean'})
    @Column({type: 'boolean', default: true})
    isActive: boolean;

    @Exclude()
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @Exclude()
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;
}
