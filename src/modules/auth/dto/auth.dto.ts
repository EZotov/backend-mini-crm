import {ApiProperty} from '@nestjs/swagger';
import {IsString} from 'class-validator';

export class LoginRequestDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class LoginResponseDto {
  @ApiProperty()
  @IsString()
  access_token: string;
}
