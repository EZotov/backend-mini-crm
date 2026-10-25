import {ApiProperty} from '@nestjs/swagger';
import {IsOptional, IsString} from 'class-validator';

import {ACTIVITY_STATUS_ENUM} from '../consts';
import type {ActivityStatus} from '../types';

export class ActivityListFiltersDto {
    @ApiProperty({required: false, type: 'string', format: 'uuid'})
    @IsString()
    @IsOptional()
    dealId?: string;

    @ApiProperty({required: false, type: 'string', format: 'uuid'})
    @IsString()
    @IsOptional()
    createdById?: string;

    @ApiProperty({required: false, type: 'string', format: 'uuid'})
    @IsString()
    @IsOptional()
    assignedId?: string;

    @ApiProperty({required: false, enum: ACTIVITY_STATUS_ENUM})
    @IsString()
    @IsOptional()
    status?: ActivityStatus;
}

export class ActivityListByStatusFiltersDto {
    @ApiProperty({required: false, type: 'string', format: 'uuid'})
    @IsString()
    @IsOptional()
    dealId?: string;
}
