import {ApiProperty} from '@nestjs/swagger';
import {Type} from 'class-transformer';

import {UserDto} from '~/modules/user/dto/user.dto';

import {DEAL_STATUS_ENUM} from '../consts';
import type {DealStatus} from '../types';
import {DealDto} from './deal.dto';

export class DealHistoryDto {
    @ApiProperty()
    id: string;

    @ApiProperty({enum: DEAL_STATUS_ENUM})
    fromStatus: DealStatus;

    @ApiProperty({enum: DEAL_STATUS_ENUM})
    toStatus: DealStatus;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty({type: DealDto})
    @Type(() => DealDto)
    deal: DealDto;

    @ApiProperty({type: UserDto, nullable: true})
    @Type(() => UserDto)
    changedBy: UserDto | null;
}
