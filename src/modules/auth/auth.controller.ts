import {Body, Controller, Post} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';

import {LoginRequestDto} from './dto/auth.dto';

// POST /auth/login — Вход (возвращает Access/Refresh токены и роль).
// POST /auth/refresh — Обновление JWT-токена.
// POST /auth/logout — Инвалидация токена.

@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController {
  constructor() {}

  @ApiOperation({summary: 'Вход пользователя'})
  @Post('login')
  login(@Body() loginDto: LoginRequestDto) {
    console.log(loginDto);

    return '';
  }

  @ApiOperation({summary: 'Выход пользователя'})
  @Post('logout')
  logout() {
    return '';
  }

  @ApiOperation({summary: 'Обновление JWT-токена'})
  @Post('refresh')
  refresh() {
    return '';
  }
}
