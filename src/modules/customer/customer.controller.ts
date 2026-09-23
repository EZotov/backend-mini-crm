import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query} from '@nestjs/common';
import {ApiOkResponse, ApiOperation, ApiTags} from '@nestjs/swagger';

import {CustomerService} from './customer.service';
import {CreateCustomerDto, CustomerAllDto, CustomerDto, IdResponseDto} from './dto/customer.dto';

@ApiTags('Заказчики')
@Controller('customers')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) {}

    @ApiOperation({summary: 'Получить всех заказчиков'})
    @ApiOkResponse({
        description: 'Успешное получение данных клиента',
        type: CustomerAllDto,
    })
    @Get()
    getAll(
        @Query('pageNum', ParseIntPipe) pageNum: number,
        @Query('pageSize', ParseIntPipe) pageSize: number,
    ): Promise<CustomerAllDto> {
        return this.customerService.getList(pageSize, pageNum);
    }

    @ApiOperation({summary: 'Получить заказчика'})
    @ApiOkResponse({
        description: 'Успешное получение данных клиента',
        type: CustomerDto,
    })
    @Get(':id')
    get(@Param('id') id: string) {
        return this.customerService.getById(id);
    }

    @ApiOperation({summary: 'Создать нового заказчика'})
    @ApiOkResponse({type: IdResponseDto})
    @Post()
    create(@Body() createDto: CreateCustomerDto): Promise<IdResponseDto> {
        return this.customerService.create(createDto);
    }

    @ApiOperation({summary: 'Изменить данные заказчика'})
    @ApiOkResponse({type: IdResponseDto})
    @Put(':id')
    update(@Param('id') id: string, @Body() updateDto: CreateCustomerDto) {
        return this.customerService.updateById(id, updateDto);
    }

    @ApiOperation({summary: 'Удалить заказчика'})
    @ApiOkResponse()
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.customerService.removeById(id);
    }
}
