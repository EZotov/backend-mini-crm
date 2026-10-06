import {Body, Controller, Delete, Param, Post, Put} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';

import {ApiOkModifyResponse} from '@decorators/api-response-swagger.decorator';
import {CreateResponseDto} from '@dto/index';
import {ParseUUIDModifyPipe} from '~/utils/pipes/uuid.pipe';

import {CreateRoleDto} from './dto/role.dto';
import {UserService} from './user.service';

@ApiTags('Роли')
@Controller('roles')
export class RoleController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({summary: 'Создать роль'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Post()
    createRole(@Body() createDto: CreateRoleDto) {
        return this.userService.createRole(createDto);
    }

    @ApiOperation({summary: 'Изменить роль'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Put(':id')
    updateRole(@Param('id', ParseUUIDModifyPipe) id: string, @Body() updateDto: CreateRoleDto) {
        return this.userService.updateRoleById(id, updateDto);
    }

    @ApiOperation({summary: 'Удалить роль'})
    @Delete(':id')
    deleteRole(@Param('id', ParseUUIDModifyPipe) id: string) {
        return this.userService.removeRoleById(id);
    }
}
