import {Controller, Delete, Get, Patch, Post} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';

@ApiTags('Пользователи')
@Controller()
export class UserController {
    @ApiOperation({summary: 'Получить всех пользователей'})
    @Get('users')
    getAllUsers() {}

    @ApiOperation({summary: 'Получить пользователя'})
    @Get('users/:id')
    getUser() {}

    @ApiOperation({summary: 'Изменить данные пользователя'})
    @Patch('users/:id')
    updateUser() {}

    @ApiOperation({summary: 'Удалить пользователя'})
    @Delete('users/:id')
    deleteUser() {}

    @ApiOperation({summary: 'Создать роль'})
    @Post('roles')
    createRole() {}

    @ApiOperation({summary: 'Изменить роль'})
    @Patch('roles/:id')
    updateRole() {}

    @ApiOperation({summary: 'Удалить роль'})
    @Delete('roles/:id')
    deleteRole() {}
}
