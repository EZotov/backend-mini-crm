import {Controller, Delete, Get, Patch, Post} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';

@ApiTags('Сделки')
@Controller('deals')
export class DealController {
    @ApiOperation({summary: 'Получить все сделки'})
    @Get()
    getAll() {
        return 'Not implemented';
    }

    @ApiOperation({summary: 'Получить сделку'})
    @Get(':id')
    get() {
        return 'Not implemented';
    }

    @ApiOperation({summary: 'Создать сделку'})
    @Post()
    create() {
        return 'Not implemented';
    }

    @ApiOperation({summary: 'Изменить сделку'})
    @Patch(':id')
    update() {
        return 'Not implemented';
    }

    @ApiOperation({summary: 'Удалить сделку'})
    @Delete(':id')
    delete() {
        return 'Not implemented';
    }
}
