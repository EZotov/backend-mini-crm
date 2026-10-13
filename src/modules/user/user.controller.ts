import {Controller, Delete, ForbiddenException, Get, Param, ParseIntPipe, Put, Query, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {plainToInstance} from 'class-transformer';

import {ROLES} from '@consts/index';
import {ApiOkModifyResponse} from '@decorators/api-response-swagger.decorator';
import {UserTokenData} from '@decorators/user-auth-data.decorator';
import {CollectionResponseDto, CreateResponseDto, ResponseDto} from '@dto/api.dto';
import {JwtAuthGuard} from '@guards/auth.guard';
import {ParseUUIDModifyPipe} from '~/utils/pipes/uuid.pipe';

import {UpdateUserDto, UserDto} from './dto/user.dto';
import {UserService} from './user.service';

@ApiTags('Пользователи')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({summary: 'Получить всех пользователей'})
    @ApiOkModifyResponse(UserDto, {isArray: true})
    @Get()
    async getAll(
        @Query('pageNum', ParseIntPipe) pageNum: number,
        @Query('pageSize', ParseIntPipe) pageSize: number,
    ): Promise<CollectionResponseDto<UserDto>> {
        const {users, total} = await this.userService.getUsersList(pageNum, pageSize);

        return new CollectionResponseDto<UserDto>({
            data: users.map((user) => plainToInstance(UserDto, user)),
            total,
        });
    }

    @ApiOperation({summary: 'Получить профиль пользователя'})
    @ApiOkModifyResponse(UserDto)
    @Get(':id')
    async getUser(@Param('id', ParseUUIDModifyPipe) userId: string): Promise<ResponseDto<UserDto>> {
        const user = await this.userService.getUserById(userId);

        return new ResponseDto({
            data: plainToInstance(UserDto, user),
        });
    }

    @ApiOperation({summary: 'Изменить данные чужого профиля'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Put(':id')
    async updateUserProfile(
        @Param('id', ParseUUIDModifyPipe) userId: string,
        updateDto: UpdateUserDto,
    ): Promise<ResponseDto<CreateResponseDto>> {
        await this.userService.updateUserProfile(userId, updateDto);

        return new ResponseDto<CreateResponseDto>({
            data: new CreateResponseDto({id: userId}),
        });
    }

    @ApiOperation({summary: 'Удалить пользователя'})
    @Delete(':id')
    deleteUser(@Param('id', ParseUUIDModifyPipe) userId: string, @UserTokenData('role') role: string): Promise<void> {
        if (role !== ROLES.ADMIN) {
            throw new ForbiddenException('Не хватает прав доступа');
        }

        return this.userService.removeUserById(userId);
    }
}

@ApiTags('Мой профиль')
@UseGuards(JwtAuthGuard)
@Controller('users/me')
export class MeUserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({summary: 'Получить свой профиль по токену'})
    @ApiOkModifyResponse(UserDto)
    @Get()
    async me(@UserTokenData('id', ParseUUIDModifyPipe) id: string): Promise<ResponseDto<UserDto>> {
        const user = await this.userService.getUserById(id);

        return new ResponseDto({
            data: plainToInstance(UserDto, user),
        });
    }

    @ApiOperation({summary: 'Изменить данные своего профиля'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Put()
    async updateMyProfile(
        @UserTokenData('id', ParseUUIDModifyPipe) userId: string,
        updateDto: UpdateUserDto,
    ): Promise<ResponseDto<CreateResponseDto>> {
        await this.userService.updateUserProfile(userId, updateDto);

        return new ResponseDto({
            data: new CreateResponseDto({id: userId}),
        });
    }

    @ApiOperation({summary: 'Удалить свой аккаунт'})
    @Delete()
    deleteMyAccount(@UserTokenData('id', ParseUUIDModifyPipe) userId: string): Promise<void> {
        return this.userService.removeUserById(userId);
    }
}
