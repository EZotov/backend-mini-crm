import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';

import {UserTokenData} from '@decorators/user-auth-data.decorator';
import {ParseUUIDModifyPipe} from '~/utils/pipes/uuid.pipe';

import {DealService} from './deal.service';
import {ChangeStatusDealDto, CreateDealDto, UpdateDealDto} from './dto/deal.dto';

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
    @Put(':id')
    update(@Param('id', ParseUUIDModifyPipe) id: string, @Body() dto: UpdateDealDto) {
        return this.dealService.updateById(id, dto);
    }

    @ApiOperation({summary: 'Изменить статус сделки'})
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
