import {ApiProperty} from '@nestjs/swagger';
import {Expose, Type} from 'class-transformer';

import {DealDto} from './deal.dto';

export class DealHistoryDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    actionDescription: string;

    @ApiProperty({type: 'string', nullable: true})
    @Expose()
    changedById: string | null;

    @ApiProperty({type: 'string', nullable: true})
    @Expose()
    changedByFullname: string | null;

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty({type: DealDto})
    @Expose()
    @Type(() => DealDto)
    deal: DealDto;
}
