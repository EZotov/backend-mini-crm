import {Controller} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';

@ApiTags('Пользователи')
@Controller('users')
export class UserController {}
