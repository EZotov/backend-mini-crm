import {ApiProperty} from '@nestjs/swagger';
import {Type} from 'class-transformer';
import {IsOptional, IsString, IsUUID} from 'class-validator';

import {DealDto} from '~/modules/deal/dto/deal.dto';
import {UserDto} from '~/modules/user/dto/user.dto';

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

    @ApiProperty({type: UserDto, required: false})
    @IsOptional()
    @IsUUID()
    assignedId?: UserDto;
}

export class ActivityShortDto {
    @ApiProperty()
    id: string;

    @ApiProperty({enum: ACTIVITY_ENUM})
    type: ActivityType;

    @ApiProperty()
    description: string;

    @ApiProperty({type: 'string', format: 'date-time'})
    dueDate: Date;

    @ApiProperty({type: DealDto})
    @Type(() => DealDto)
    deal: DealDto;

    @ApiProperty({type: UserDto})
    @Type(() => UserDto)
    assigned: UserDto;

    @ApiProperty({type: UserDto})
    @Type(() => UserDto)
    createdBy: UserDto;
}

export class GroupedActivityByStatusDto {
    constructor(data: Partial<GroupedActivityByStatusDto>) {
        Object.assign(this, data);
    }

    @ApiProperty({enum: ACTIVITY_STATUS_ENUM})
    status: ActivityStatus;

    @ApiProperty({type: 'integer'})
    count: number;

    @ApiProperty({type: ActivityShortDto, isArray: true})
    activities: ActivityShortDto[];
}
