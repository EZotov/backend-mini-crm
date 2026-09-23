import {Controller, Delete, Get, Patch, Post} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';

@ApiTags('Заказчики')
@Controller('customers')
export class CustomerController {
    @ApiOperation({summary: 'Получить всех заказчиков'})
    @Get()
    getAll() {
        return 'Not implemented';
    }

    @ApiOperation({summary: 'Получить заказчика'})
    @Get(':id')
    get() {
        return 'Not implemented';
    }

    @ApiOperation({summary: 'Создать нового заказчика'})
    @Post()
    create() {
        return 'Not implemented';
    }

    @ApiOperation({summary: 'Изменить данные заказчика'})
    @Patch(':id')
    update() {
        return 'Not implemented';
    }

    @ApiOperation({summary: 'Удалить заказчика'})
    @Delete(':id')
    delete() {
        return 'Not implemented';
    }
}
