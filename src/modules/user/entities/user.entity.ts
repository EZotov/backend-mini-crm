import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({select: false})
  password: string;

  @Column()
  firstName: string;

  @Column({nullable: true})
  patronymic: string;

  @Column()
  lastName: string;

  @Column({length: 200, default: 'Пока ничего не рассказал о себе'})
  about: string;

  @Column({default: 'https://i.pravatar.cc/300'})
  avatar: string;

  @Column({unique: true})
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;
}

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({unique: true})
  name: string;

  @Column()
  label: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
