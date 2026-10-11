import {ApiProperty} from '@nestjs/swagger';
import {IsOptional, IsString, IsUUID} from 'class-validator';

import {ACTIVITY_ENUM, ACTIVITY_STATUS_ENUM} from '../consts';
import type {ActivityStatus, ActivityType} from '../types';

export class CreateOrUpdateActivityDto {
    @ApiProperty({enum: ACTIVITY_ENUM})
    @IsString()
    type: ActivityType;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    dueDate: Date;

    @ApiProperty({type: 'string', enum: ACTIVITY_STATUS_ENUM, required: false})
    @IsOptional()
    @IsString()
    status?: ActivityStatus;

    @ApiProperty()
    @IsUUID()
    dealId: string;

    @ApiProperty()
    @IsUUID()
    managerId: string;
}
