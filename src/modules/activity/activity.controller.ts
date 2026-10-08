import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';

import {ApiOkModifyResponse} from '@decorators/api-response-swagger.decorator';
import {CollectionResponseDto, CreateResponseDto, ResponseDto} from '@dto/index';
import {ParseUUIDModifyPipe} from '~/utils/pipes/uuid.pipe';

import {CreateCompanyDto} from '../company/dto/company.dto';
import {ActivityService} from './activity.service';
import {Activity} from './entities/activity.entity';

@ApiTags('Задачи')
@Controller('activities')
export class ActivityController {
    constructor(private readonly activityService: ActivityService) {}

    @ApiOperation({summary: 'Получить список задач'})
    @ApiOkModifyResponse(Activity, {isArray: true})
    @Get()
    getAll(
        @Query('pageNum', ParseIntPipe) pageNum: number,
        @Query('pageSize', ParseIntPipe) pageSize: number,
    ): Promise<CollectionResponseDto<Activity>> {
        return {
            data: [],
            total,
        };
    }

    @ApiOperation({summary: 'Получить задачу'})
    @ApiOkModifyResponse(Activity)
    @Get(':id')
    get(@Param('id', ParseUUIDModifyPipe) id: string): Promise<ResponseDto<Activity>> {
        return {};
    }

    @ApiOperation({summary: 'Создать новую задачу'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Post()
    async create(@Body() dto: CreateCompanyDto): Promise<ResponseDto<CreateResponseDto>> {
        const createdId = '';

        return new ResponseDto<CreateResponseDto>({
            data: new CreateResponseDto({id: createdId}),
        });
    }

    @ApiOperation({summary: 'Обновить задачу'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Put(':id')
    update(
        @Param('id', ParseUUIDModifyPipe) id: string,
        @Body() dto: CreateCompanyDto,
    ): Promise<ResponseDto<CreateResponseDto>> {
        return new ResponseDto<CreateResponseDto>({
            data: new CreateResponseDto({id}),
        });
    }

    @ApiOperation({summary: 'Удалить задачу'})
    @Delete(':id')
    delete(@Param('id', ParseUUIDModifyPipe) id: string): Promise<void> {
        return this.activityService.deleteById(id);
    }
}
