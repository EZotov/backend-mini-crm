import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {plainToInstance} from 'class-transformer';

import {ApiOkModifyResponse} from '@decorators/api-response-swagger.decorator';
import {AuthProtected} from '@decorators/auth.decorator';
import {UserTokenData} from '@decorators/user-auth-data.decorator';
import {CollectionResponseDto, CreateResponseDto, ResponseDto} from '@dto/api.dto';
import {ParseUUIDModifyPipe} from '~/utils/pipes/uuid.pipe';

import {ChangeDealFunnelStage, ChangeStatusDealDto, CreateOrUpdateDealDto, DealDto} from './dto/deal.dto';
import {DealHistoryDto} from './dto/deal-history.dto';
import {DealListFiltersDto} from './dto/filters.dto';
import {DealService} from './services/deal.service';
import {DealHistoryService} from './services/deal-history.service';

@ApiTags('Сделки')
@AuthProtected()
@Controller('deals')
export class DealController {
    constructor(
        private readonly dealService: DealService,
        private readonly dealHistoryService: DealHistoryService,
    ) {}

    @ApiOperation({summary: 'Получить все сделки'})
    @ApiOkModifyResponse(DealDto, {isArray: true})
    @Get()
    async getAll(
        @Query('pageNum', ParseIntPipe) pageNum: number,
        @Query('pageSize', ParseIntPipe) pageSize: number,
        @Query() filtersDto?: DealListFiltersDto,
    ): Promise<CollectionResponseDto<DealDto>> {
        const {deals, total} = await this.dealService.getList(pageNum, pageSize, filtersDto);

        return new CollectionResponseDto({
            data: plainToInstance(DealDto, deals, {excludeExtraneousValues: true}),
            total,
        });
    }

    @ApiOperation({summary: 'Получить сделку'})
    @ApiOkModifyResponse(DealDto)
    @Get(':id')
    async get(@Param('id', ParseUUIDModifyPipe) id: string): Promise<ResponseDto<DealDto>> {
        const deal = await this.dealService.getById(id);

        return new ResponseDto({
            data: plainToInstance(DealDto, deal, {excludeExtraneousValues: true}),
        });
    }

    @ApiOperation({summary: 'Создать сделку'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Post()
    async create(
        @UserTokenData('id') userId: string,
        @Body() dto: CreateOrUpdateDealDto,
    ): Promise<ResponseDto<CreateResponseDto>> {
        const createdId = await this.dealService.create(userId, dto);

        return new ResponseDto({
            data: new CreateResponseDto({id: createdId}),
        });
    }

    @ApiOperation({summary: 'Изменить сделку'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Put(':id')
    async update(
        @UserTokenData('id') userId: string,
        @Param('id', ParseUUIDModifyPipe) id: string,
        @Body() dto: CreateOrUpdateDealDto,
    ): Promise<ResponseDto<CreateResponseDto>> {
        await this.dealService.updateById(userId, id, dto);

        return new ResponseDto({
            data: new CreateResponseDto({id}),
        });
    }

    @ApiOperation({summary: 'Изменить статус сделки'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Patch(':id/status')
    async changeStatus(
        @Param('id', ParseUUIDModifyPipe) id: string,
        @UserTokenData('id') currentUserid: string,
        @Body() dto: ChangeStatusDealDto,
    ): Promise<ResponseDto<CreateResponseDto>> {
        await this.dealService.updateStatusById(id, currentUserid, dto.status);

        return new ResponseDto({
            data: new CreateResponseDto({id}),
        });
    }

    @ApiOperation({summary: 'Изменить этап воронки сделки'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Patch(':id/funnel-stage')
    changeFunnelStage(
        @UserTokenData('id') currentUserid: string,
        @Param('id', ParseUUIDModifyPipe) id: string,
        @Body() dto: ChangeDealFunnelStage,
    ): ResponseDto<string> {
        return new ResponseDto({
            data: 'Not implemented',
        });
    }

    @ApiOperation({summary: 'Получить историю по сделке'})
    @ApiOkModifyResponse(DealHistoryDto, {isArray: true})
    @Get(':id/history')
    async getDealHistory(
        @Param('id', ParseUUIDModifyPipe) id: string,
        @Query('pageNum', ParseIntPipe) pageNum: number,
        @Query('pageSize', ParseIntPipe) pageSize: number,
    ): Promise<CollectionResponseDto<DealHistoryDto>> {
        const {logs, total} = await this.dealHistoryService.getDealHistoryList(pageNum, pageSize);

        return new CollectionResponseDto({
            data: plainToInstance(DealHistoryDto, logs, {excludeExtraneousValues: true}),
            total,
        });
    }

    @ApiOperation({summary: 'Удалить сделку'})
    @Delete(':id')
    delete(@Param('id', ParseUUIDModifyPipe) id: string): Promise<void> {
        return this.dealService.deleteById(id);
    }
}
