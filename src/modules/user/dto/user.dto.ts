import {ApiProperty, OmitType, PickType} from '@nestjs/swagger';
import {Transform} from 'class-transformer';
import {IsString, Matches, MaxLength, MinLength} from 'class-validator';

import {REG_EXP} from '@consts/index';

import {User} from '../entities/user.entity';

export class CreateUserDto extends PickType(User, ['firstName', 'lastName', 'email']) {
    @ApiProperty({required: false})
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
export class UpdateUserDto extends OmitType(User, [
    'createdAt',
    'updatedAt',
    'deals',
    'id',
    'deletedAt',
    'password',
    'email',
]) {}
export class UpdatePasswordDto {
    @ApiProperty({description: 'Новый пароль'})
    @IsString()
    @MinLength(6, {message: 'Пароль должен быть от 6 символов'})
    @MaxLength(20, {message: 'Пароль должен быть не более 20 символов'})
    @Matches(REG_EXP.PASSWORD, {message: 'Пароль не должен содержать кириллицу, спецсимволы, пробелы'})
    newPassword: string;

    @IsString()
    @ApiProperty({description: 'Подтвердить пароль'})
    confirmPassword: string;
}
export class UserDto extends OmitType(User, ['createdAt', 'updatedAt', 'deals', 'deletedAt', 'password', 'role']) {
    @ApiProperty({description: 'Название роли пользователя'})
    @Transform(({obj}: {obj: User}) => obj.role?.title || null)
    role: string | null;
}
