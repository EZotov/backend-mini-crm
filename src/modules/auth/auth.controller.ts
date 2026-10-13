import {Body, Controller, Post, Req, Res, UseGuards} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {ApiExcludeEndpoint, ApiOperation, ApiTags} from '@nestjs/swagger';
import type {Request, Response} from 'express';

import {ApiOkModifyResponse} from '@decorators/api-response-swagger.decorator';
import {Cookie} from '@decorators/cookie.decorator';
import {ResponseDto} from '@dto/api.dto';
import {JwtAuthGuard} from '@guards/auth.guard';
import {clearRefreshTokenCookie, setRefreshTokenInCookie} from '~/utils';

import {CreateUserDto} from '../user/dto/user.dto';
import {AuthService} from './auth.service';
import {LoginDto, LoginRequestDto, RefreshAccessTokenDto, TokensDto} from './dto/auth.dto';

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
    async registration(
        @Body() dto: CreateUserDto,
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<ResponseDto<LoginDto>> {
        const {userId, ...tokens} = await this.authService.registration(dto);

        const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
        const userAgent = req.headers['user-agent'] || 'unknown';

        await this.authService.saveSession({
            userId,
            ip,
            refreshToken: tokens.refreshToken,
            userAgent,
            createdAt: Date.now().toString(),
        });

        setRefreshTokenInCookie(res, tokens.refreshToken, {
            isProduction: this.isProduction,
            days: 2,
        });

        return new ResponseDto({
            data: new LoginDto(tokens),
        });
    }

    @ApiOperation({summary: 'Войти в систему'})
    @ApiOkModifyResponse(TokensDto)
    @Post('sign-in')
    async login(
        @Body() dto: LoginRequestDto,
        @Req() req: Request,
        @Res({passthrough: true}) res: Response,
    ): Promise<ResponseDto<TokensDto>> {
        const {userId, ...tokens} = await this.authService.login(dto);

        const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
        const userAgent = req.headers['user-agent'] || 'unknown';

        await this.authService.saveSession({
            userId,
            ip,
            refreshToken: tokens.refreshToken,
            userAgent,
            createdAt: Date.now().toString(),
        });

        setRefreshTokenInCookie(res, tokens.refreshToken, {
            isProduction: this.isProduction,
            days: 2,
        });

        return new ResponseDto({
            data: new TokensDto(tokens),
        });
    }

    @ApiOperation({summary: 'Обновить токен аутентификации'})
    @ApiOkModifyResponse(RefreshAccessTokenDto)
    @Post('refresh')
    async refresh(
        @Cookie('refreshToken') refreshToken: string,
        @Res({passthrough: true}) res: Response,
    ): Promise<ResponseDto<RefreshAccessTokenDto>> {
        try {
            const accessToken = await this.authService.generateAccessTokenByRefreshToken(refreshToken);

            return new ResponseDto({
                data: new RefreshAccessTokenDto({accessToken}),
            });
        } catch (error) {
            clearRefreshTokenCookie(res, {isProduction: this.isProduction});
            throw error;
        }
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
