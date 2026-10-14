import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {plainToInstance} from 'class-transformer';

import {ApiOkModifyResponse} from '@decorators/api-response-swagger.decorator';
import {UserTokenData} from '@decorators/user-auth-data.decorator';
import {CollectionResponseDto, CreateResponseDto, ResponseDto} from '@dto/api.dto';
import {JwtAuthGuard} from '@guards/auth.guard';
import {ParseUUIDModifyPipe} from '~/utils/pipes/uuid.pipe';

import {ActivityService} from './activity.service';
import {CreateOrUpdateActivityDto, GroupedActivityByStatusDto} from './dto/activity.dto';
import {Activity} from './entities/activity.entity';
import {GroupedActivityEntities} from './types';

@ApiTags('Задачи')
@UseGuards(JwtAuthGuard)
@Controller('activities')
export class ActivityController {
    constructor(private readonly activityService: ActivityService) {}

    @ApiOperation({summary: 'Получить список задач по сделке'})
    @ApiOkModifyResponse(Activity, {isArray: true})
    @Get()
    async getAllByDeal(@Query('dealId', ParseUUIDModifyPipe) dealId: string) {
        const {activities, total} = await this.activityService.getAllByDeal(dealId);

        return new CollectionResponseDto({
            data: activities as Activity[],
            total,
        });
    }

    @ApiOperation({summary: 'Получить список задач по сделке с группировкой по статусу'})
    @ApiOkModifyResponse(GroupedActivityByStatusDto, {isArray: true})
    @Get('/byStatus')
    async getAllByDealInStatus(@Query('dealId', ParseUUIDModifyPipe) dealId: string) {
        const {activities, total} = await this.activityService.getAllByDeal(dealId, true);

        return new CollectionResponseDto({
            data: plainToInstance(GroupedActivityByStatusDto, activities as GroupedActivityEntities[]),
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
        @Param('id', ParseUUIDModifyPipe) id: string,
        @Body() dto: CreateOrUpdateActivityDto,
    ): Promise<ResponseDto<CreateResponseDto>> {
        const updatedId = await this.activityService.updateById(id, dto);

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
