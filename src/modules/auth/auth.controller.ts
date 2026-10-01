import {Controller, Post} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';

import {UserService} from '../user/user.service';

@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({summary: 'Зарегистрировать нового пользователя'})
    @Post('sign-up')
    registration() {
        return 'Not implemented';
    }

    @ApiOperation({summary: 'Войти в систему'})
    @Post('sign-in')
    login() {
        return 'Not implemented';
    }

    @ApiOperation({summary: 'Обновить токен аутентификации'})
    @Post('refresh')
    refresh() {
        return 'Not implemented';
    }

    @ApiOperation({summary: 'Выйти из системы'})
    @Post('logout')
    logout() {
        return 'Not implemented';
    }
}
