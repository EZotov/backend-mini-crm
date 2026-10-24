import {ApiProperty} from '@nestjs/swagger';
import {Column, Entity} from 'typeorm';

import {BaseEntity} from '@dto/entity.dto';

@Entity('funnels')
export class Funnel extends BaseEntity {
    @ApiProperty()
    @Column({type: 'varchar'})
    title: string;

    @ApiProperty({type: 'boolean'})
    @Column({type: 'boolean', default: true})
    isActive: boolean;
}
