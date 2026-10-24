import {ApiProperty} from '@nestjs/swagger';
import {CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

/**
 * Общий абстрактный класс сущности, где всегда есть основные служебные поля (id, created_at, updated_at)
 */
export abstract class BaseEntity {
    @ApiProperty({
        type: 'string',
        format: 'uuid',
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({name: 'created_at', type: 'timestamp', select: false})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at', type: 'timestamp', select: false})
    updatedAt: Date;
}
