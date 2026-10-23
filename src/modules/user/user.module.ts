import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {RoleController} from './controllers/role.controller';
import {MeUserController, UserController} from './controllers/user.controller';
import {Role} from './entities/role.entity';
import {User} from './entities/user.entity';
import {UserService} from './user.service';

@Module({
    imports: [TypeOrmModule.forFeature([Role, User])],
    providers: [UserService],
    controllers: [RoleController, MeUserController, UserController],
    exports: [UserService],
})
export class UserModule {}
