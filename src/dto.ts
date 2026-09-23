import {ApiProperty} from '@nestjs/swagger';
import {IsString} from 'class-validator';

export class IdResponseDto {
    @ApiProperty()
    @IsString()
    id: string;
}
