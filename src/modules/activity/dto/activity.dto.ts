import {ApiProperty} from '@nestjs/swagger';
import {Expose, Type} from 'class-transformer';
import {IsString, IsUUID} from 'class-validator';

import {DealShortDto} from '~/modules/deal/dto/deal.dto';
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

    @ApiProperty({type: 'string', enum: ACTIVITY_STATUS_ENUM})
    @IsString()
    status: ActivityStatus;

    @ApiProperty()
    @IsUUID()
    dealId: string;

    @ApiProperty()
    @IsUUID()
    assignedId: string;
}

export class ActivityDto {
    @ApiProperty({type: 'string', format: 'uuid'})
    @Expose()
    id: string;

    @ApiProperty({enum: ACTIVITY_ENUM})
    @Expose()
    type: ActivityType;

    @ApiProperty()
    @Expose()
    description: string;

    @ApiProperty({type: 'string', format: 'date-time'})
    @Expose()
    dueDate: Date;

    @ApiProperty({type: DealShortDto})
    @Expose()
    @Type(() => DealShortDto)
    deal: DealShortDto;

    @ApiProperty({type: UserDto, nullable: true})
    @Expose()
    @Type(() => UserDto)
    assigned: UserDto | null;

    @ApiProperty({type: UserDto})
    @Expose()
    @Type(() => UserDto)
    createdBy: UserDto;
}

export class GroupedActivityByStatusDto {
    constructor(data: Partial<GroupedActivityByStatusDto>) {
        Object.assign(this, data);
    }

    @ApiProperty({enum: ACTIVITY_STATUS_ENUM})
    @Expose()
    status: ActivityStatus;

    @ApiProperty({type: 'integer'})
    @Expose()
    count: number;

    @ApiProperty({type: ActivityDto, isArray: true})
    @Expose()
    activities: ActivityDto[];
}
