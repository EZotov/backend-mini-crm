import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {plainToInstance} from 'class-transformer';

import {ROLES} from '@consts/index';
import {ApiOkModifyResponse} from '@decorators/api-response-swagger.decorator';
import {AuthProtected} from '@decorators/auth.decorator';
import {UserTokenData} from '@decorators/user-auth-data.decorator';
import {CollectionResponseDto, CreateResponseDto, ResponseDto} from '@dto/api.dto';
import {ParseUUIDModifyPipe} from '~/utils/pipes/uuid.pipe';

import {UserListFiltersDto} from '../dto/filters.dto';
import {UpdatePasswordDto, UpdateUserDto, UserDto} from '../dto/user.dto';
import {UserService} from '../services/user.service';

@ApiTags('Пользователи')
@AuthProtected(ROLES.ADMIN)
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({summary: 'Получить всех пользователей (для админа)'})
    @ApiOkModifyResponse(UserDto, {isArray: true})
    @Get()
    async getAll(
        @Query('pageNum', ParseIntPipe) pageNum: number,
        @Query('pageSize', ParseIntPipe) pageSize: number,
        @Query() filterDto?: UserListFiltersDto,
    ): Promise<CollectionResponseDto<UserDto>> {
        const {users, total} = await this.userService.getUsersList(pageNum, pageSize, filterDto);

        return new CollectionResponseDto<UserDto>({
            data: plainToInstance(UserDto, users, {excludeExtraneousValues: true}),
            total,
        });
    }

    @ApiOperation({summary: 'Получить профиль пользователя (для админа)'})
    @ApiOkModifyResponse(UserDto)
    @Get(':id')
    async getUser(@Param('id', ParseUUIDModifyPipe) userId: string): Promise<ResponseDto<UserDto>> {
        const user = await this.userService.getUserById(userId);

        return new ResponseDto({
            data: plainToInstance(UserDto, user, {excludeExtraneousValues: true}),
        });
    }

    @ApiOperation({summary: 'Изменить данные чужого профиля (для админа)'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Put(':id')
    async updateUserProfile(
        @Param('id', ParseUUIDModifyPipe) userId: string,
        @Body() updateDto: UpdateUserDto,
    ): Promise<ResponseDto<CreateResponseDto>> {
        await this.userService.updateUserProfile(userId, updateDto);

        return new ResponseDto<CreateResponseDto>({
            data: new CreateResponseDto({id: userId}),
        });
    }

    @ApiOperation({summary: 'Удалить пользователя (для админа)'})
    @Delete(':id')
    deleteUser(@Param('id', ParseUUIDModifyPipe) userId: string): Promise<void> {
        return this.userService.removeUserById(userId);
    }
}

@ApiTags('Мой профиль')
@AuthProtected()
@Controller('users/me')
export class MeUserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({summary: 'Получить свой профиль по токену'})
    @ApiOkModifyResponse(UserDto)
    @Get()
    async me(@UserTokenData('id', ParseUUIDModifyPipe) id: string): Promise<ResponseDto<UserDto>> {
        const user = await this.userService.getUserById(id);

        return new ResponseDto({
            data: plainToInstance(UserDto, user, {excludeExtraneousValues: true}),
        });
    }

    @ApiOperation({summary: 'Изменить данные своего профиля'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Put()
    async updateMyProfile(
        @UserTokenData('id', ParseUUIDModifyPipe) userId: string,
        @Body() dto: UpdateUserDto,
    ): Promise<ResponseDto<CreateResponseDto>> {
        await this.userService.updateUserProfile(userId, dto);

        return new ResponseDto({
            data: new CreateResponseDto({id: userId}),
        });
    }

    @ApiOperation({summary: 'Изменить пароль своего профиля'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Post()
    async updateMyProfilePassword(
        @UserTokenData('id', ParseUUIDModifyPipe) userId: string,
        @Body() updateDto: UpdatePasswordDto,
    ): Promise<ResponseDto<CreateResponseDto>> {
        const updatedUserId = await this.userService.updatePassword(userId, updateDto);

        return new ResponseDto({
            data: new CreateResponseDto({id: updatedUserId}),
        });
    }

    @ApiOperation({summary: 'Удалить свой аккаунт'})
    @Delete()
    deleteMyAccount(@UserTokenData('id', ParseUUIDModifyPipe) userId: string): Promise<void> {
        return this.userService.removeUserById(userId);
    }
}
