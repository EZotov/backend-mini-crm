import {ApiProperty} from '@nestjs/swagger';
import {Expose, Transform} from 'class-transformer';

export class DealHistoryDto {
    @ApiProperty({type: 'string', format: 'uuid'})
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

    @ApiProperty({type: 'string', format: 'uuid', example: 'UUID сделки'})
    @Expose()
    @Transform(({obj}) => obj?.deal?.id)
    dealId: string;
}
