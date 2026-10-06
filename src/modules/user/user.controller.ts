import {Controller, Delete, ForbiddenException, Get, Param, ParseIntPipe, Put, Query} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';

import {ROLES} from '@consts/index';
import {ApiOkModifyResponse} from '@decorators/api-response-swagger.decorator';
import {UserTokenData} from '@decorators/user-auth-data.decorator';
import {CreateResponseDto} from '@dto/index';
import {ParseUUIDModifyPipe} from '~/utils/pipes/uuid.pipe';

import {UpdateUserDto, UserDto} from './dto/user.dto';
import {UserService} from './user.service';

@ApiTags('Пользователи')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({summary: 'Получить всех пользователей'})
    @ApiOkModifyResponse(UserDto, {isArray: true})
    @Get()
    getAllUsers(@Query('pageNum', ParseIntPipe) pageNum: number, @Query('pageSize', ParseIntPipe) pageSize: number) {
        return this.userService.getUsersList(pageNum, pageSize);
    }

    @ApiOperation({summary: 'Получить профиль пользователя'})
    @ApiOkModifyResponse(UserDto)
    @Get(':id')
    getUser(@Param('id', ParseUUIDModifyPipe) userId: string) {
        return this.userService.getUserById(userId);
    }

    @ApiOperation({summary: 'Изменить данные чужого профиля'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Put(':id')
    updateUserProfile(@Param('id', ParseUUIDModifyPipe) userId: string, updateDto: UpdateUserDto) {
        return this.userService.updateUserProfile(userId, updateDto);
    }

    @ApiOperation({summary: 'Удалить пользователя'})
    @Delete(':id')
    deleteUser(@Param('id', ParseUUIDModifyPipe) userId: string, @UserTokenData('role') role: string) {
        if (role !== ROLES.ADMIN) {
            throw new ForbiddenException('Не хватает прав доступа');
        }

        return this.userService.removeUserById(userId);
    }
}

@ApiTags('Мой профиль')
@Controller('users/me')
export class MeUserController {
    constructor(private readonly userService: UserService) {}
    @ApiOperation({summary: 'Получить свой профиль по токену'})
    @Get()
    me(@UserTokenData('id', ParseUUIDModifyPipe) id: string) {
        return this.userService.getUserById(id);
    }

    @ApiOperation({summary: 'Изменить данные своего профиля'})
    @Put()
    updateMyProfile(@UserTokenData('id', ParseUUIDModifyPipe) userId: string, updateDto: UpdateUserDto) {
        return this.userService.updateUserProfile(userId, updateDto);
    }

    @ApiOperation({summary: 'Удалить свой аккаунт'})
    @Delete()
    deleteMyAccount(@UserTokenData('id', ParseUUIDModifyPipe) userId: string) {
        return this.userService.removeUserById(userId);
    }
}
