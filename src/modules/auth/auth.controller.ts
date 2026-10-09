import {Controller, Post} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';

import {Cookie} from '@decorators/cookie.decorator';
import {ResponseDto} from '@dto/index';

import {CreateUserDto} from '../user/dto/user.dto';
import {AuthService} from './auth.service';
import {LoginDto, LoginRequestDto, RefreshTokenDto} from './dto/auth.dto';

@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({summary: 'Зарегистрировать нового пользователя'})
    @Post('sign-up')
    async registration(dto: CreateUserDto): Promise<ResponseDto<LoginDto>> {
        const tokens = await this.authService.registration(dto);

        return new ResponseDto({
            data: new LoginDto(tokens),
        });
    }

    @ApiOperation({summary: 'Войти в систему'})
    @Post('sign-in')
    async login(dto: LoginRequestDto): Promise<ResponseDto<LoginDto>> {
        const tokens = await this.authService.login(dto);

        return new ResponseDto({
            data: new LoginDto(tokens),
        });
    }

    @ApiOperation({summary: 'Обновить токен аутентификации'})
    @Post('refresh')
    async refresh(@Cookie('refreshToken') refreshToken: string): Promise<ResponseDto<RefreshTokenDto>> {
        const accessToken = await this.authService.generateAccessTokenByRefreshToken(refreshToken);

        return new ResponseDto({
            data: new RefreshTokenDto({accessToken}),
        });
    }

    @ApiOperation({summary: 'Выйти из системы'})
    @Post('logout')
    logout(): ResponseDto<string> {
        return {data: 'Not implemented'};
    }
}
