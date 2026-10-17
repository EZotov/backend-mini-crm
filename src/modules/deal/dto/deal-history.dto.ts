import {ApiProperty} from '@nestjs/swagger';
import {Expose, Type} from 'class-transformer';

import {UserDto} from '~/modules/user/dto/user.dto';

import {DEAL_STATUS_ENUM} from '../consts';
import type {DealStatus} from '../types';
import {DealDto} from './deal.dto';

export class DealHistoryDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty({enum: DEAL_STATUS_ENUM})
    @Expose()
    fromStatus: DealStatus;

    @ApiProperty({enum: DEAL_STATUS_ENUM})
    @Expose()
    toStatus: DealStatus;

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty({type: DealDto})
    @Expose()
    @Type(() => DealDto)
    deal: DealDto;

    @ApiProperty({type: UserDto, nullable: true})
    @Expose()
    @Type(() => UserDto)
    changedBy: UserDto | null;
}
