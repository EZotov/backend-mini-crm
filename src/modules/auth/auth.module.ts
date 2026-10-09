import {Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';

import {JwtAuthGuard} from '@guards/auth.guard';

import {UserModule} from '../user/user.module';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';

@Module({
    imports: [UserModule, JwtModule, PassportModule],
    providers: [AuthService, JwtAuthGuard],
    controllers: [AuthController],
    exports: [JwtAuthGuard],
})
export class AuthModule {}
