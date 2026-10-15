import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';

import {ApiOkModifyResponse} from '@decorators/api-response-swagger.decorator';
import {CollectionResponseDto, CreateResponseDto, ResponseDto} from '@dto/api.dto';
import {JwtAuthGuard} from '@guards/auth.guard';
import {ParseUUIDModifyPipe} from '~/utils/pipes/uuid.pipe';

import {CreateRoleDto} from './dto/role.dto';
import {Role} from './entities/role.entity';
import {UserService} from './user.service';

@ApiTags('Роли')
@AuthProtected()
@Controller('roles')
export class RoleController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({summary: 'Получить список ролей'})
    @ApiOkModifyResponse(Role, {isArray: true})
    @Get()
    async getAll(): Promise<CollectionResponseDto<Role>> {
        const {list, total} = await this.userService.getRolesList();

        return new CollectionResponseDto({
            data: list,
            total,
        });
    }

    @ApiOperation({summary: 'Создать роль'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Post()
    async create(@Body() createDto: CreateRoleDto): Promise<ResponseDto<CreateResponseDto>> {
        const createdId = await this.userService.createRole(createDto);

        return new ResponseDto({
            data: new CreateResponseDto({id: createdId}),
        });
    }

    @ApiOperation({summary: 'Изменить роль'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Put(':id')
    async update(
        @Param('id', ParseUUIDModifyPipe) id: string,
        @Body() updateDto: CreateRoleDto,
    ): Promise<ResponseDto<CreateResponseDto>> {
        await this.userService.updateRoleById(id, updateDto);

        return new ResponseDto({
            data: new CreateResponseDto({id}),
        });
    }

    @ApiOperation({summary: 'Удалить роль'})
    @Delete(':id')
    delete(@Param('id', ParseUUIDModifyPipe) id: string): Promise<void> {
        return this.userService.removeRoleById(id);
    }
}
