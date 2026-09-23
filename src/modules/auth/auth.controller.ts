import {Controller, Post} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';

@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController {
    @ApiOperation({summary: 'Зарегистрировать нового пользователя'})
    @Post('sign-up')
    registration() {}

    @ApiOperation({summary: 'Войти в систему'})
    @Post('sign-in')
    login() {}

    @ApiOperation({summary: 'Обновить токен аутентификации'})
    @Post('refresh')
    refresh() {}

    @ApiOperation({summary: 'Выйти из системы'})
    @Post('logout')
    logout() {}
}
