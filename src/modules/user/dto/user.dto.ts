import {ApiProperty} from '@nestjs/swagger';
import {Transform} from 'class-transformer';
import {IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength} from 'class-validator';

import {REG_EXP} from '@consts/index';

import {User} from '../entities/user.entity';

export class CreateUserDto {
    @ApiProperty()
    @IsEmail(undefined, {message: 'Некорректный формат почты'})
    email: string;

    @ApiProperty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsString()
    lastName: string;

    @ApiProperty({required: false})
    @IsOptional()
    @IsString()
    patronymic?: string;

    @ApiProperty()
    @IsString()
    @Matches(REG_EXP.PASSWORD, {message: 'Неверный формат пароля'})
    password: string;

    @ApiProperty()
    @IsString()
    @Matches(REG_EXP.PASSWORD, {message: 'Неверный формат пароля'})
    confirmPassword: string;
}

export class UpdateUserDto {
    @ApiProperty()
    @IsEmail(undefined, {message: 'Некорректный формат почты'})
    email: string;

    @ApiProperty()
    @IsString()
    firstName: string;

    @ApiProperty({required: false})
    patronymic?: string;

    @ApiProperty()
    @IsString()
    lastName: string;
}
export class UpdatePasswordDto {
    @ApiProperty({description: 'Новый пароль'})
    @IsString()
    @MinLength(6, {message: 'Пароль должен быть от 6 символов'})
    @MaxLength(20, {message: 'Пароль должен быть не более 20 символов'})
    @Matches(REG_EXP.PASSWORD, {message: 'Пароль не должен содержать кириллицу, спецсимволы, пробелы'})
    currentPassword: string;

    @ApiProperty({description: 'Новый пароль'})
    @IsString()
    @MinLength(6, {message: 'Пароль должен быть от 6 символов'})
    @MaxLength(20, {message: 'Пароль должен быть не более 20 символов'})
    @Matches(REG_EXP.PASSWORD, {message: 'Пароль не должен содержать кириллицу, спецсимволы, пробелы'})
    newPassword: string;

    @ApiProperty({description: 'Подтвердить пароль'})
    @IsString()
    @MinLength(6, {message: 'Пароль должен быть от 6 символов'})
    @MaxLength(20, {message: 'Пароль должен быть не более 20 символов'})
    @Matches(REG_EXP.PASSWORD, {message: 'Пароль не должен содержать кириллицу, спецсимволы, пробелы'})
    confirmPassword: string;
}

export class UserDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty({required: false, nullable: true})
    patronymic: string | null;

    @ApiProperty()
    lastName: string;

    @ApiProperty({type: 'string', required: false, nullable: true})
    @Transform(({obj}: {obj: User}) => obj.role?.title || null)
    role: string | null;
}
