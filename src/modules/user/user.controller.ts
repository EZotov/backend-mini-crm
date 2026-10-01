import {Body, Controller, Delete, ForbiddenException, Get, Param, ParseIntPipe, Post, Put, Query} from '@nestjs/common';
import {ApiOkResponse, ApiOperation, ApiTags} from '@nestjs/swagger';

import {ROLES} from '@consts/index';
import {UserTokenData} from '@decorators/user-auth-data.decorator';
import {IdResponseDto} from '~/dto';
import {ListResponse} from '~/interfaces';

import {CreateRoleDto} from './dto/role.dto';
import {UpdateUserDto} from './dto/user.dto';
import {Role} from './entities/role.entity';
import {User} from './entities/user.entity';
import {UserService} from './user.service';

@ApiTags('Пользователи')
@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({summary: 'Получить всех пользователей (для админов)'})
    @Get('users')
    getAllUsers(@Query('pageNum', ParseIntPipe) pageNum: number, @Query('pageSize', ParseIntPipe) pageSize: number) {
        return this.userService.getUsersList(pageNum, pageSize);
    }

    @ApiOperation({summary: 'Получить свой профиль по токену'})
    @Get('me')
    me(@UserTokenData('id') id: string) {
        return this.userService.getUserById(id);
    }

    @ApiOperation({summary: 'Получить профиль пользователя'})
    @ApiOkResponse({type: User})
    @Get('users/:id')
    getUser(@Param('id') userId: string) {
        return this.userService.getUserById(userId);
    }

    @ApiOperation({summary: 'Изменить данные своего профиля'})
    @Put('users/me')
    updateMyProfile(@UserTokenData('id') userId: string, updateDto: UpdateUserDto) {
        return this.userService.updateUserProfile(userId, updateDto);
    }

    @ApiOperation({summary: 'Изменить данные чужого профиля (для админов)'})
    @Put('users/:id')
    updateUserProfile(@Param('id') userId: string, updateDto: UpdateUserDto) {
        return this.userService.updateUserProfile(userId, updateDto);
    }

    @ApiOperation({summary: 'Удалить свой аккаунт'})
    @Delete('users/me')
    deleteMyAccount(@UserTokenData('id') userId: string) {
        return this.userService.removeUserById(userId);
    }

    @ApiOperation({summary: 'Удалить пользователя (для админов)'})
    @Delete('users/:id')
    deleteUser(@Param('id') userId: string, @UserTokenData('role') role: string) {
        if (role !== ROLES.ADMIN) {
            throw new ForbiddenException('Не хватает прав доступа');
        }

        return this.userService.removeUserById(userId);
    }

    @ApiOperation({summary: 'Получить список ролей (для админов)'})
    @ApiOkResponse({type: Role, isArray: true})
    @Get('roles')
    getAllRoles(): Promise<ListResponse<Role>> {
        return this.userService.getRolesList();
    }

    @ApiOperation({summary: 'Создать роль (для админов)'})
    @ApiOkResponse({type: IdResponseDto})
    @Post('roles')
    createRole(@Body() createDto: CreateRoleDto) {
        return this.userService.createRole(createDto);
    }

    @ApiOperation({summary: 'Изменить роль (для админов)'})
    @ApiOkResponse({type: IdResponseDto})
    @Put('roles/:id')
    updateRole(@Param('id') id: string, @Body() updateDto: CreateRoleDto) {
        return this.userService.updateRoleById(id, updateDto);
    }

    @ApiOperation({summary: 'Удалить роль (для админов)'})
    @ApiOkResponse()
    @Delete('roles/:id')
    deleteRole(@Param('id') id: string) {
        return this.userService.removeRoleById(id);
    }
}
