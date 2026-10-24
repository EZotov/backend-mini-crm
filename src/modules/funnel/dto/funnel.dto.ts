import {ApiProperty} from '@nestjs/swagger';
import {IsBoolean, IsOptional, IsString} from 'class-validator';

export class CreateFunnelDto {
    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty({type: 'boolean', required: false})
    @IsBoolean()
    @IsOptional()
    isActive: boolean;
}

export class UpdateFunnelDto {
    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty({type: 'boolean'})
    @IsBoolean()
    isActive: boolean;
}
