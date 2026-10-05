import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';

import {ParseUUIDModifyPipe} from '~/utils/pipes/uuid.pipe';

import {DealService} from './deal.service';
import {CreateDealDto, UpdateDealDto} from './dto/deal.dto';

@ApiTags('Сделки')
@Controller('deals')
export class DealController {
    constructor(private readonly dealService: DealService) {}

    @ApiOperation({summary: 'Получить все сделки'})
    @Get()
    getAll(@Query('pageNum', ParseIntPipe) pageNum: number, @Query('pageSize', ParseIntPipe) pageSize: number) {
        return this.dealService.getList(pageNum, pageSize);
    }

    @ApiOperation({summary: 'Получить сделку'})
    @Get(':id')
    get(@Param('id', ParseUUIDModifyPipe) id: string) {
        return this.dealService.getById(id);
    }

    @ApiOperation({summary: 'Создать сделку'})
    @Post()
    create(@Body() dto: CreateDealDto) {
        return this.dealService.create(dto);
    }

    @ApiOperation({summary: 'Изменить сделку'})
    @Patch(':id')
    update(@Param('id', ParseUUIDModifyPipe) id: string, @Body() dto: UpdateDealDto) {
        return this.dealService.updateById(id, dto);
    }

    @ApiOperation({summary: 'Удалить сделку'})
    @Delete(':id')
    delete(@Param('id', ParseUUIDModifyPipe) id: string) {
        return this.dealService.deleteById(id);
    }
}
