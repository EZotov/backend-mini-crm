import {OmitType, PickType} from '@nestjs/swagger';

import {User} from '../entities/user.entity';

export class CreateUserDto extends PickType(User, ['email', 'password']) {}
export class UpdateUserDto extends OmitType(User, ['createdAt', 'updatedAt', 'deals', 'id', 'deletedAt', 'password']) {}
