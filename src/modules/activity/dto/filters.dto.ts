import {ApiProperty} from '@nestjs/swagger';

import {ACTIVITY_STATUS_ENUM} from '../consts';
import type {ActivityStatus} from '../types';

export class ActivityListFiltersDto {
    @ApiProperty({required: false})
    createdById?: string;

    @ApiProperty({required: false})
    assignedId?: string;

    @ApiProperty({required: false, enum: ACTIVITY_STATUS_ENUM})
    status?: ActivityStatus;
}
