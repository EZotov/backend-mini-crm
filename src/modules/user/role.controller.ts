import {Body, Controller, Delete, Param, Post, Put} from '@nestjs/common';
import {ApiOkResponse, ApiOperation, ApiTags} from '@nestjs/swagger';

import {IdResponseDto} from '@dto/index';

import {CreateRoleDto} from './dto/role.dto';
import {UserService} from './user.service';

@ApiTags('Роли')
@Controller('roles')
export class RoleController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({summary: 'Создать роль'})
    @ApiOkResponse({type: IdResponseDto})
    @Post()
    createRole(@Body() createDto: CreateRoleDto) {
        return this.userService.createRole(createDto);
    }

    @ApiOperation({summary: 'Изменить роль'})
    @ApiOkResponse({type: IdResponseDto})
    @Put(':id')
    updateRole(@Param('id') id: string, @Body() updateDto: CreateRoleDto) {
        return this.userService.updateRoleById(id, updateDto);
    }

    @ApiOperation({summary: 'Удалить роль'})
    @ApiOkResponse()
    @Delete(':id')
    deleteRole(@Param('id') id: string) {
        return this.userService.removeRoleById(id);
    }
}
