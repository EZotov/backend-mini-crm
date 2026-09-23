import {Controller, Delete, Get, Patch, Post} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';

@ApiTags('Пользователи')
@Controller()
export class UserController {
    @ApiOperation({summary: 'Получить всех пользователей'})
    @Get('users')
    getAllUsers() {
        return 'Not implemented';
    }

    @ApiOperation({summary: 'Получить пользователя'})
    @Get('users/:id')
    getUser() {
        return 'Not implemented';
    }

    @ApiOperation({summary: 'Изменить данные пользователя'})
    @Patch('users/:id')
    updateUser() {
        return 'Not implemented';
    }

    @ApiOperation({summary: 'Удалить пользователя'})
    @Delete('users/:id')
    deleteUser() {
        return 'Not implemented';
    }

    @ApiOperation({summary: 'Создать роль'})
    @Post('roles')
    createRole() {
        return 'Not implemented';
    }

    @ApiOperation({summary: 'Изменить роль'})
    @Patch('roles/:id')
    updateRole() {
        return 'Not implemented';
    }

    @ApiOperation({summary: 'Удалить роль'})
    @Delete('roles/:id')
    deleteRole() {
        return 'Not implemented';
    }
}
