import {ApiProperty} from '@nestjs/swagger';

import {DEAL_STATUS_ENUM} from '../consts';
import type {DealStatus} from '../types';

export class DealListFiltersDto {
    @ApiProperty({required: false})
    managerId?: string;

    @ApiProperty({required: false})
    createdById?: string;

    @ApiProperty({required: false})
    customerId?: string;

    @ApiProperty({required: false, enum: DEAL_STATUS_ENUM})
    status?: DealStatus;
}
