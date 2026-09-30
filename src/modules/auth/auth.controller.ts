import {Controller, Get, Post, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {UserTokenData} from '~/decorators/user-auth-data.decorator';

import {UserService} from '../user/user.service';
import {JwtAuthGuard} from './guards/auth.guard';

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

    @ApiOperation({summary: 'Получить свой профиль по токену'})
    @UseGuards(JwtAuthGuard)
    @Get('me')
    me(@UserTokenData('id') id: string) {
        return this.userService.getUserById(id);
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
