import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {ApiOkResponse, ApiOperation, ApiTags} from '@nestjs/swagger';
import {IdResponseDto} from '~/dto';
import {ListResponse} from '~/types';

import {CreateRoleDto} from './dto/role.dto';
import {Role} from './entities/role.entity';
import {User} from './entities/user.entity';
import {UserService} from './user.service';

@ApiTags('Пользователи')
@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({summary: 'Получить всех пользователей'})
    @Get('users')
    getAllUsers() {
        return 'Not implemented';
    }

    @ApiOperation({summary: 'Получить пользователя'})
    @ApiOkResponse({type: User})
    @Get('users/:id')
    getUser() {
        return 'Not implemented';
    }

    @ApiOperation({summary: 'Изменить данные пользователя'})
    @Put('users/:id')
    updateUser() {
        return 'Not implemented';
    }

    @ApiOperation({summary: 'Удалить пользователя'})
    @Delete('users/:id')
    deleteUser() {
        return 'Not implemented';
    }

    @ApiOperation({summary: 'Получить список ролей'})
    @ApiOkResponse({type: Role, isArray: true})
    @Get('roles')
    getAllRoles(): Promise<ListResponse<Role>> {
        return this.userService.getRolesList();
    }

    @ApiOperation({summary: 'Создать роль'})
    @ApiOkResponse({type: IdResponseDto})
    @Post('roles')
    createRole(@Body() createDto: CreateRoleDto) {
        return this.userService.create(createDto);
    }

    @ApiOperation({summary: 'Изменить роль'})
    @ApiOkResponse({type: IdResponseDto})
    @Put('roles/:id')
    updateRole(@Param('id') id: string, @Body() updateDto: CreateRoleDto) {
        return this.userService.updateById(id, updateDto);
    }

    @ApiOperation({summary: 'Удалить роль'})
    @ApiOkResponse()
    @Delete('roles/:id')
    deleteRole(@Param('id') id: string) {
        return this.userService.removeById(id);
    }
}
