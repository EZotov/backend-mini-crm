import {Controller, Delete, Get, Patch, Post} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';

@ApiTags('Заказчики')
@Controller('customers')
export class CustomerController {
    @ApiOperation({summary: 'Получить всех заказчиков'})
    @Get()
    getAll() {}

    @ApiOperation({summary: 'Получить заказчика'})
    @Get(':id')
    get() {}

    @ApiOperation({summary: 'Создать нового заказчика'})
    @Post()
    create() {}

    @ApiOperation({summary: 'Изменить данные заказчика'})
    @Patch(':id')
    update() {}

    @ApiOperation({summary: 'Удалить заказчика'})
    @Delete(':id')
    delete() {}
}
