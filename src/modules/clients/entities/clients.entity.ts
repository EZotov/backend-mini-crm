import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

@Entity()
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  typeProperty: string;

  @Column()
  title: string;

  @Column({nullable: true})
  shortTitle: string;

  @Column({nullable: true})
  contactLastName: string;

  @Column({nullable: true})
  contactFirstName: string;

  @Column({nullable: true})
  contactPhone: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
