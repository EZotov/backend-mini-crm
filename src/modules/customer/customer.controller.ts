import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {plainToInstance} from 'class-transformer';

import {ApiOkModifyResponse} from '@decorators/api-response-swagger.decorator';
import {AuthProtected} from '@decorators/auth.decorator';
import {CollectionResponseDto, CreateResponseDto, ResponseDto} from '@dto/api.dto';
import {ParseUUIDModifyPipe} from '~/utils/pipes/uuid.pipe';

import {CustomerService} from './customer.service';
import {CreateOrUpdateCustomerDto, CustomerDto} from './dto/customer.dto';

@ApiTags('Заказчики')
@AuthProtected()
@Controller('customers')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) {}

    @ApiOperation({summary: 'Получить всех заказчиков'})
    @ApiOkModifyResponse(CustomerDto, {isArray: true})
    @Get()
    async getAll(
        @Query('pageNum', ParseIntPipe) pageNum: number,
        @Query('pageSize', ParseIntPipe) pageSize: number,
    ): Promise<CollectionResponseDto<CustomerDto>> {
        const {customers, totalCounts} = await this.customerService.getList(pageNum, pageSize);

        return new CollectionResponseDto({
            data: plainToInstance(CustomerDto, customers, {excludeExtraneousValues: true}),
            total: totalCounts,
        });
    }

    @ApiOperation({summary: 'Получить заказчика'})
    @ApiOkModifyResponse(CustomerDto)
    @Get(':id')
    async get(@Param('id', ParseUUIDModifyPipe) id: string): Promise<ResponseDto<CustomerDto>> {
        const customer = await this.customerService.getById(id);

        return new ResponseDto({
            data: plainToInstance(CustomerDto, customer, {excludeExtraneousValues: true}),
        });
    }

    @ApiOperation({summary: 'Создать нового заказчика'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Post()
    async create(@Body() createDto: CreateOrUpdateCustomerDto): Promise<ResponseDto<CreateResponseDto>> {
        const id = await this.customerService.create(createDto);

        return new ResponseDto<CreateResponseDto>({
            data: new CreateResponseDto({id}),
        });
    }

    @ApiOperation({summary: 'Изменить данные заказчика'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Put(':id')
    async update(
        @Param('id', ParseUUIDModifyPipe) id: string,
        @Body() updateDto: CreateOrUpdateCustomerDto,
    ): Promise<ResponseDto<CreateResponseDto>> {
        await this.customerService.updateById(id, updateDto);

        return new ResponseDto<CreateResponseDto>({
            data: new CreateResponseDto({id}),
        });
    }

    @ApiOperation({summary: 'Удалить заказчика'})
    @Delete(':id')
    delete(@Param('id', ParseUUIDModifyPipe) id: string): Promise<void> {
        return this.customerService.removeById(id);
    }
}
