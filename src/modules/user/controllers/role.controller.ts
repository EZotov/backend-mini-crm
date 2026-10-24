import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';

import {ROLES} from '@consts/index';
import {ApiOkModifyResponse} from '@decorators/api-response-swagger.decorator';
import {AuthProtected} from '@decorators/auth.decorator';
import {CollectionResponseDto, CreateResponseDto, ResponseDto} from '@dto/api.dto';
import {ParseUUIDModifyPipe} from '~/utils/pipes/uuid.pipe';

import {CreateOrUpdateRoleDto} from '../dto/role.dto';
import {Role} from '../entities/role.entity';
import {RoleService} from '../services/role.service';

@ApiTags('Роли')
@AuthProtected(ROLES.ADMIN)
@Controller('roles')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @ApiOperation({summary: 'Получить список ролей'})
    @ApiOkModifyResponse(Role, {isArray: true})
    @Get()
    async getAll(): Promise<CollectionResponseDto<Role>> {
        const {list, total} = await this.roleService.getList();

        return new CollectionResponseDto({
            data: list,
            total,
        });
    }

    @ApiOperation({summary: 'Создать роль'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Post()
    async create(@Body() createDto: CreateOrUpdateRoleDto): Promise<ResponseDto<CreateResponseDto>> {
        const createdId = await this.roleService.create(createDto);

        return new ResponseDto({
            data: new CreateResponseDto({id: createdId}),
        });
    }

    @ApiOperation({summary: 'Изменить роль'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Put(':id')
    async update(
        @Param('id', ParseUUIDModifyPipe) id: string,
        @Body() updateDto: CreateOrUpdateRoleDto,
    ): Promise<ResponseDto<CreateResponseDto>> {
        await this.roleService.updateById(id, updateDto);

        return new ResponseDto({
            data: new CreateResponseDto({id}),
        });
    }

    @ApiOperation({summary: 'Удалить роль'})
    @Delete(':id')
    delete(@Param('id', ParseUUIDModifyPipe) id: string): Promise<void> {
        return this.roleService.removeById(id);
    }
}
