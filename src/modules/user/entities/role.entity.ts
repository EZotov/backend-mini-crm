import {ApiProperty} from '@nestjs/swagger';
import {Exclude} from 'class-transformer';
import {Check, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

export const accessAction = {
    CREATE: 'CREATE',
    READ: 'READ',
    DELETE: 'DELETE',
} as const;

@Entity({name: 'roles'})
@Check(`"title" = UPPER("title")`)
export class Role {
    @ApiProperty({type: 'string', format: 'uuid'})
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column({unique: true})
    title: string;

    @ApiProperty({
        type: 'string',
        isArray: true,
        description: 'Список прав доступа',
        example: ['user:write', 'user:read'],
    })
    @Column('json', {default: () => "'[]'"})
    access: string[];

    @Exclude()
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @Exclude()
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;
}
