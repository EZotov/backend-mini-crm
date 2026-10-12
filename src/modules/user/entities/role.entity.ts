import {ApiProperty} from '@nestjs/swagger';
import {Exclude} from 'class-transformer';
import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

export const accessAction = {
    CREATE: 'CREATE',
    READ: 'READ',
    DELETE: 'DELETE',
} as const;

@Entity({name: 'roles'})
export class Role {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column()
    title: string;

    @ApiProperty()
    @Column('text', {array: true, default: '{}'})
    access: string[];

    @Exclude()
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @Exclude()
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;
}
