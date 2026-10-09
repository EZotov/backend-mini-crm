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
    ): CollectionResponseDto<Activity> {
        return {
            data: [],
            total: 0,
        };
    }

    @ApiOperation({summary: 'Получить задачу'})
    @ApiOkModifyResponse(Activity)
    @Get(':id')
    get(@Param('id', ParseUUIDModifyPipe) id: string): ResponseDto<Activity> {
        return new ResponseDto<Activity>({
            data: {} as Activity,
        });
    }

    @ApiOperation({summary: 'Создать новую задачу'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Post()
    create(@Body() dto: CreateCompanyDto): ResponseDto<CreateResponseDto> {
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
    ): ResponseDto<CreateResponseDto> {
        return new ResponseDto<CreateResponseDto>({
            data: new CreateResponseDto({id}),
        });
    }

    @ApiOperation({summary: 'Удалить задачу'})
    @Delete(':id')
    delete(@Param('id', ParseUUIDModifyPipe) id: string): void {
        return;
    }
}
