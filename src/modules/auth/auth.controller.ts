import {Body, Controller, Post, Res, UseGuards} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {ApiExcludeEndpoint, ApiOperation, ApiTags} from '@nestjs/swagger';
import type {Response} from 'express';

import {ApiOkModifyResponse} from '@decorators/api-response-swagger.decorator';
import {Cookie} from '@decorators/cookie.decorator';
import {ResponseDto} from '@dto/index';
import {JwtAuthGuard} from '@guards/auth.guard';
import {setRefreshTokenInCookie} from '~/utils';

import {CreateUserDto} from '../user/dto/user.dto';
import {AuthService} from './auth.service';
import {LoginDto, LoginRequestDto, RefreshAccessTokenDto} from './dto/auth.dto';

@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController {
    isProduction: boolean;

    constructor(
        private readonly configService: ConfigService,
        private readonly authService: AuthService,
    ) {
        this.isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    }

    @ApiOperation({summary: 'Зарегистрировать нового пользователя'})
    @ApiOkModifyResponse(LoginDto)
    @Post('sign-up')
    async registration(@Body() dto: CreateUserDto, @Res() res: Response): Promise<ResponseDto<LoginDto>> {
        const tokens = await this.authService.registration(dto);

        setRefreshTokenInCookie(res, tokens.refreshToken, {
            isProduction: this.isProduction,
            days: 2,
        });

        return new ResponseDto({
            data: new LoginDto(tokens),
        });
    }

    @ApiOperation({summary: 'Войти в систему'})
    @ApiOkModifyResponse(LoginDto)
    @Post('sign-in')
    async login(@Body() dto: LoginRequestDto, @Res({passthrough: true}) res: Response): Promise<ResponseDto<LoginDto>> {
        const tokens = await this.authService.login(dto);

        setRefreshTokenInCookie(res, tokens.refreshToken, {
            isProduction: this.isProduction,
            days: 2,
        });

        return new ResponseDto({
            data: new LoginDto(tokens),
        });
    }

    @ApiOperation({summary: 'Обновить токен аутентификации'})
    @ApiOkModifyResponse(RefreshAccessTokenDto)
    @UseGuards(JwtAuthGuard)
    @Post('refresh')
    async refresh(@Cookie('refreshToken') refreshToken: string): Promise<ResponseDto<RefreshAccessTokenDto>> {
        const accessToken = await this.authService.generateAccessTokenByRefreshToken(refreshToken);

        return new ResponseDto({
            data: new RefreshAccessTokenDto({accessToken}),
        });
    }

    @ApiExcludeEndpoint()
    @ApiOperation({summary: 'Выйти из системы'})
    @ApiOkModifyResponse()
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    logout(): ResponseDto<string> {
        return {data: 'Not implemented'};
    }
}
