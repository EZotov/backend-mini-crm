import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {Role} from './entities/role.entity';
import {User} from './entities/user.entity';
import {UserController} from './user.controller';
import {UserService} from './user.service';

@Module({
    imports: [TypeOrmModule.forFeature([Role, User])],
    providers: [UserService],
    controllers: [UserController],
})
export class UserModule {}
