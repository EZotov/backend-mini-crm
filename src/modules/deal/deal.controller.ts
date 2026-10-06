import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';

import {ApiOkModifyResponse} from '@decorators/api-response-swagger.decorator';
import {UserTokenData} from '@decorators/user-auth-data.decorator';
import {CreateResponseDto} from '@dto/index';
import {ParseUUIDModifyPipe} from '~/utils/pipes/uuid.pipe';

import {DealService} from './deal.service';
import {ChangeStatusDealDto, CreateDealDto, UpdateDealDto} from './dto/deal.dto';
import {Deal} from './entities/deal.entity';

@ApiTags('Сделки')
@Controller('deals')
export class DealController {
    constructor(private readonly dealService: DealService) {}

    @ApiOperation({summary: 'Получить все сделки'})
    @ApiOkModifyResponse(Deal, {isArray: true})
    @Get()
    getAll(@Query('pageNum', ParseIntPipe) pageNum: number, @Query('pageSize', ParseIntPipe) pageSize: number) {
        return this.dealService.getList(pageNum, pageSize);
    }

    @ApiOperation({summary: 'Получить сделку'})
    @ApiOkModifyResponse(Deal)
    @Get(':id')
    get(@Param('id', ParseUUIDModifyPipe) id: string) {
        return this.dealService.getById(id);
    }

    @ApiOperation({summary: 'Создать сделку'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Post()
    create(@Body() dto: CreateDealDto) {
        return this.dealService.create(dto);
    }

    @ApiOperation({summary: 'Изменить сделку'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Put(':id')
    update(@Param('id', ParseUUIDModifyPipe) id: string, @Body() dto: UpdateDealDto) {
        return this.dealService.updateById(id, dto);
    }

    @ApiOperation({summary: 'Изменить статус сделки'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Patch(':id')
    changeStatus(
        @Param('id', ParseUUIDModifyPipe) id: string,
        @UserTokenData('id') managerId: string,
        @Body() dto: ChangeStatusDealDto,
    ) {
        return this.dealService.updateStatusById(id, managerId, dto.status);
    }

    @ApiOperation({summary: 'Удалить сделку'})
    @Delete(':id')
    delete(@Param('id', ParseUUIDModifyPipe) id: string) {
        return this.dealService.deleteById(id);
    }
}
