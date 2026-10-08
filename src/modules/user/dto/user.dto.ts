import {ApiProperty, OmitType, PickType} from '@nestjs/swagger';
import {Transform} from 'class-transformer';

import {User} from '../entities/user.entity';

export class CreateUserDto extends PickType(User, ['email', 'password']) {}
export class UpdateUserDto extends OmitType(User, ['createdAt', 'updatedAt', 'deals', 'id', 'deletedAt', 'password']) {}
export class UserDto extends OmitType(User, [
    'createdAt',
    'updatedAt',
    'deals',
    'id',
    'deletedAt',
    'password',
    'role',
]) {
    @ApiProperty({description: 'Название роли пользователя'})
    @Transform(({obj}: {obj: User}) => obj.role?.title || null)
    role: string | null;
}
