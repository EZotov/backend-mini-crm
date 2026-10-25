import {Body, Controller, Post, Req, Res} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {ApiOkResponse, ApiOperation, ApiTags} from '@nestjs/swagger';
import type {Request, Response} from 'express';

import {ApiOkModifyResponse} from '@decorators/api-response-swagger.decorator';
import {AuthProtected} from '@decorators/auth.decorator';
import {Cookie} from '@decorators/cookie.decorator';
import {UserTokenData} from '@decorators/user-auth-data.decorator';
import {ResponseDto} from '@dto/api.dto';
import {clearRefreshTokenCookie, setRefreshTokenInCookie} from '~/utils/helpers';

import {CreateUserDto} from '../user/dto/user.dto';
import {AuthService} from './auth.service';
import {LoginRequestDto, RefreshAccessTokenDto, TokensDto} from './dto/auth.dto';

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
    @ApiOkModifyResponse(TokensDto)
    @Post('sign-up')
    async registration(
        @Body() dto: CreateUserDto,
        @Req() req: Request,
        @Res({passthrough: true}) res: Response,
    ): Promise<ResponseDto<TokensDto>> {
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
            data: new TokensDto(tokens),
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
            clearRefreshTokenCookie(res, this.isProduction);
            throw error;
        }
    }

    @ApiOperation({summary: 'Выйти из системы'})
    @AuthProtected()
    @ApiOkResponse()
    @Post('logout')
    async logout(@UserTokenData('id') userId: string, @Res({passthrough: true}) res: Response): Promise<void> {
        await this.authService.logout(userId);

        clearRefreshTokenCookie(res, this.isProduction);
    }
}
