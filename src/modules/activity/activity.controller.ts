import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';

import {ApiOkModifyResponse} from '@decorators/api-response-swagger.decorator';
import {CollectionResponseDto, CreateResponseDto, ResponseDto} from '@dto/index';
import {JwtAuthGuard} from '@guards/auth.guard';
import {ParseUUIDModifyPipe} from '~/utils/pipes/uuid.pipe';

import {ActivityService} from './activity.service';
import {CreateOrUpdateActivityDto} from './dto/activity.dto';
import {Activity} from './entities/activity.entity';

@ApiTags('Задачи')
@UseGuards(JwtAuthGuard)
@Controller('activities')
export class ActivityController {
    constructor(private readonly activityService: ActivityService) {}

    @ApiOperation({summary: 'Получить список задач'})
    @ApiOkModifyResponse(Activity, {isArray: true})
    @Get()
    getAll(
        @Query('pageNum', ParseIntPipe) pageNum: number,
        @Query('pageSize', ParseIntPipe) pageSize: number,
    ): CollectionResponseDto<Activity> {
        return {
            data: [],
            total: 0,
        };
    }

    @ApiOperation({summary: 'Создать новую задачу'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Post()
    async create(@Body() dto: CreateOrUpdateActivityDto): Promise<ResponseDto<CreateResponseDto>> {
        const createdId = await this.activityService.create(dto);

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
