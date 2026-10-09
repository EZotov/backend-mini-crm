import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {plainToInstance} from 'class-transformer';

import {ApiOkModifyResponse} from '@decorators/api-response-swagger.decorator';
import {UserTokenData} from '@decorators/user-auth-data.decorator';
import {CollectionResponseDto, CreateResponseDto, ResponseDto} from '@dto/index';
import {ParseUUIDModifyPipe} from '~/utils/pipes/uuid.pipe';

import {DealService} from './deal.service';
import {ChangeStatusDealDto, CreateDealDto, DealDto} from './dto/deal.dto';
import {Deal} from './entities/deal.entity';

@ApiTags('Сделки')
@Controller('deals')
export class DealController {
    constructor(private readonly dealService: DealService) {}

    @ApiOperation({summary: 'Получить все сделки'})
    @ApiOkModifyResponse(DealDto, {isArray: true})
    @Get()
    async getAll(
        @Query('pageNum', ParseIntPipe) pageNum: number,
        @Query('pageSize', ParseIntPipe) pageSize: number,
    ): Promise<CollectionResponseDto<DealDto>> {
        const {deals, total} = await this.dealService.getList(pageNum, pageSize);

        return new CollectionResponseDto({
            data: deals.map((deal) => plainToInstance(DealDto, deal)),
            total,
        });
    }

    @ApiOperation({summary: 'Получить сделку'})
    @ApiOkModifyResponse(Deal)
    @Get(':id')
    async get(@Param('id', ParseUUIDModifyPipe) id: string): Promise<ResponseDto<DealDto>> {
        const deal = await this.dealService.getById(id);

        return new ResponseDto({
            data: plainToInstance(DealDto, deal),
        });
    }

    @ApiOperation({summary: 'Создать сделку'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Post()
    async create(@Body() dto: CreateDealDto): Promise<ResponseDto<CreateResponseDto>> {
        const createdId = await this.dealService.create(dto);

        return new ResponseDto({
            data: new CreateResponseDto({id: createdId}),
        });
    }

    @ApiOperation({summary: 'Изменить сделку'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Put(':id')
    async update(
        @Param('id', ParseUUIDModifyPipe) id: string,
        @Body() dto: CreateDealDto,
    ): Promise<ResponseDto<CreateResponseDto>> {
        await this.dealService.updateById(id, dto);

        return new ResponseDto({
            data: new CreateResponseDto({id}),
        });
    }

    @ApiOperation({summary: 'Изменить статус сделки'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Patch(':id')
    async changeStatus(
        @Param('id', ParseUUIDModifyPipe) id: string,
        @UserTokenData('id') managerId: string,
        @Body() dto: ChangeStatusDealDto,
    ): Promise<ResponseDto<CreateResponseDto>> {
        await this.dealService.updateStatusById(id, managerId, dto.status);

        return new ResponseDto({
            data: new CreateResponseDto({id}),
        });
    }

    @ApiOperation({summary: 'Удалить сделку'})
    @Delete(':id')
    delete(@Param('id', ParseUUIDModifyPipe) id: string): Promise<void> {
        return this.dealService.deleteById(id);
    }
}
