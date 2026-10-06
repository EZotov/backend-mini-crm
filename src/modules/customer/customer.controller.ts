import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';

import {ApiOkModifyResponse} from '@decorators/api-response-swagger.decorator';
import {CreateResponseDto} from '~/dto';
import {ParseUUIDModifyPipe} from '~/utils/pipes/uuid.pipe';

import {CustomerService} from './customer.service';
import {CreateCustomerDto, CustomerDto} from './dto/customer.dto';

@ApiTags('Заказчики')
@Controller('customers')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) {}

    @ApiOperation({summary: 'Получить всех заказчиков'})
    @ApiOkModifyResponse(CustomerDto, {isArray: true})
    @Get()
    getAll(@Query('pageNum', ParseIntPipe) pageNum: number, @Query('pageSize', ParseIntPipe) pageSize: number) {
        return this.customerService.getList(pageNum, pageSize);
    }

    @ApiOperation({summary: 'Получить заказчика'})
    @ApiOkModifyResponse(CustomerDto)
    @Get(':id')
    get(@Param('id', ParseUUIDModifyPipe) id: string) {
        return this.customerService.getById(id);
    }

    @ApiOperation({summary: 'Создать нового заказчика'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Post()
    create(@Body() createDto: CreateCustomerDto) {
        return this.customerService.create(createDto);
    }

    @ApiOperation({summary: 'Изменить данные заказчика'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Put(':id')
    update(@Param('id', ParseUUIDModifyPipe) id: string, @Body() updateDto: CreateCustomerDto) {
        return this.customerService.updateById(id, updateDto);
    }

    @ApiOperation({summary: 'Удалить заказчика'})
    @Delete(':id')
    delete(@Param('id', ParseUUIDModifyPipe) id: string) {
        return this.customerService.removeById(id);
    }
}
