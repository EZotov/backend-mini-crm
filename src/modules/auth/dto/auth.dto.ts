import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsString, Matches} from 'class-validator';

import {REG_EXP} from '@consts/index';

export class LoginRequestDto {
    @ApiProperty()
    @IsEmail(undefined, {message: 'Некорректный формат почты'})
    email: string;

    @ApiProperty()
    @IsString()
    @Matches(REG_EXP.PASSWORD, {message: 'Неверный формат пароля'})
    password: string;
}

export class LoginDto {
    constructor(dto: Partial<LoginDto>) {
        Object.assign(this, dto);
    }

    @ApiProperty()
    @IsString()
    accessToken: string;

    @ApiProperty()
    @IsString()
    refreshToken: string;
}

export class RefreshTokenDto {
    constructor(dto: Partial<RefreshTokenDto>) {
        Object.assign(this, dto);
    }

    @ApiProperty()
    @IsString()
    accessToken: string;
}
