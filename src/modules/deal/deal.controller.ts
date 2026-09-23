import {Controller, Delete, Get, Patch, Post} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';

@ApiTags('Сделки')
@Controller('deals')
export class DealController {
    @ApiOperation({summary: 'Получить все сделки'})
    @Get()
    getAll() {}

    @ApiOperation({summary: 'Получить сделку'})
    @Get(':id')
    get() {}

    @ApiOperation({summary: 'Создать сделку'})
    @Post()
    create() {}

    @ApiOperation({summary: 'Изменить сделку'})
    @Patch(':id')
    update() {}

    @ApiOperation({summary: 'Удалить сделку'})
    @Delete(':id')
    delete() {}
}
