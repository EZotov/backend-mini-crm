import {Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

import {User} from './user.entity';

export const accessAction = {
    CREATE: 'CREATE',
    READ: 'READ',
    DELETE: 'DELETE',
} as const;

@Entity({name: 'roles'})
export class Role {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column('text', {array: true, default: '{}'})
    access: string[];

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @OneToOne(() => User, (user) => user.role)
    user: User;
}
