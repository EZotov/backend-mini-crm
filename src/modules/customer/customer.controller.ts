import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {plainToInstance} from 'class-transformer';

import {ApiOkModifyResponse} from '@decorators/api-response-swagger.decorator';
import {JwtAuthGuard} from '@guards/auth.guard';
import {CollectionResponseDto, CreateResponseDto, ResponseDto} from '~/dto';
import {ParseUUIDModifyPipe} from '~/utils/pipes/uuid.pipe';

import {CustomerService} from './customer.service';
import {CreateCustomerDto, CustomerDto} from './dto/customer.dto';

@ApiTags('Заказчики')
@UseGuards(JwtAuthGuard)
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
            data: customers.map((customer) => plainToInstance(CustomerDto, customer)),
            total: totalCounts,
        });
    }

    @ApiOperation({summary: 'Получить заказчика'})
    @ApiOkModifyResponse(CustomerDto)
    @Get(':id')
    async get(@Param('id', ParseUUIDModifyPipe) id: string): Promise<ResponseDto<CustomerDto>> {
        const customer = await this.customerService.getById(id);

        return new ResponseDto({data: plainToInstance(CustomerDto, customer)});
    }

    @ApiOperation({summary: 'Создать нового заказчика'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Post()
    async create(@Body() createDto: CreateCustomerDto): Promise<ResponseDto<CreateResponseDto>> {
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
        @Body() updateDto: CreateCustomerDto,
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
