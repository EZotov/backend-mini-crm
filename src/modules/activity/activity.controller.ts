import {Body, Controller, Delete, Get, Param, Post, Put, Query} from '@nestjs/common';
import {ApiOperation, ApiQuery, ApiTags} from '@nestjs/swagger';
import {plainToInstance} from 'class-transformer';

import {ApiOkModifyResponse} from '@decorators/api-response-swagger.decorator';
import {AuthProtected} from '@decorators/auth.decorator';
import {UserTokenData} from '@decorators/user-auth-data.decorator';
import {CollectionResponseDto, CreateResponseDto, ResponseDto} from '@dto/api.dto';
import {ParseUUIDModifyPipe} from '~/utils/pipes/uuid.pipe';

import {ActivityService} from './activity.service';
import {ActivityDto, CreateOrUpdateActivityDto, GroupedActivityByStatusDto} from './dto/activity.dto';
import {ActivityListByStatusFiltersDto, ActivityListFiltersDto} from './dto/filters.dto';
import {Activity} from './entities/activity.entity';
import {GroupedActivityEntities} from './types';

@ApiTags('Задачи')
@AuthProtected()
@Controller('activities')
export class ActivityController {
    constructor(private readonly activityService: ActivityService) {}

    @ApiOperation({summary: 'Получить список задач'})
    @ApiOkModifyResponse(ActivityDto, {isArray: true})
    @Get()
    async getAllByDeal(@Query() filterDto?: ActivityListFiltersDto) {
        const {activities, total} = await this.activityService.getList(false, filterDto);

        return new CollectionResponseDto({
            data: plainToInstance(ActivityDto, activities as Activity[], {excludeExtraneousValues: true}),
            total,
        });
    }

    @ApiOperation({summary: 'Получить список задач с группировкой по статусу'})
    @ApiOkModifyResponse(GroupedActivityByStatusDto, {isArray: true})
    @ApiQuery({name: 'dealId', required: false})
    @Get('/by-status')
    async getAllByDealInStatus(filters?: ActivityListByStatusFiltersDto) {
        const {activities, total} = await this.activityService.getList(true, filters);

        return new CollectionResponseDto({
            data: plainToInstance(GroupedActivityByStatusDto, activities as GroupedActivityEntities[], {
                excludeExtraneousValues: true,
            }),
            total,
        });
    }

    @ApiOperation({summary: 'Создать новую задачу'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Post()
    async create(
        @UserTokenData('id') userId: string,
        @Body() dto: CreateOrUpdateActivityDto,
    ): Promise<ResponseDto<CreateResponseDto>> {
        const createdId = await this.activityService.create(userId, dto);

        return new ResponseDto<CreateResponseDto>({
            data: new CreateResponseDto({id: createdId}),
        });
    }

    @ApiOperation({summary: 'Обновить задачу'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Put(':id')
    async update(
        @UserTokenData('id') userId: string,
        @Param('id', ParseUUIDModifyPipe) id: string,
        @Body() dto: CreateOrUpdateActivityDto,
    ): Promise<ResponseDto<CreateResponseDto>> {
        const updatedId = await this.activityService.updateById(userId, id, dto);

        return new ResponseDto<CreateResponseDto>({
            data: new CreateResponseDto({id: updatedId}),
        });
    }

    @ApiOperation({summary: 'Удалить задачу'})
    @Delete(':id')
    delete(@Param('id', ParseUUIDModifyPipe) id: string): Promise<void> {
        return this.activityService.removeById(id);
    }
}
