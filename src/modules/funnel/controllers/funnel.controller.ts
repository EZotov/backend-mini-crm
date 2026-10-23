import {Body, Controller, Delete, Get, Patch, Post} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';

import {ResponseDto} from '@dto/api.dto';

@ApiTags('Воронки')
@Controller('funnels')
export class FunnelController {
    @Get()
    findAll() {
        // TODO: Получить список всех воронок (возможно с пагинацией)
        // return this.funnelService.findAll();
        return new ResponseDto({
            data: 'Not implemented',
        });
    }

    @Get(':id')
    findOne() {
        // TODO: Получить одну воронку по ID
        // return this.funnelService.findOne(id);
        return new ResponseDto({
            data: 'Not implemented',
        });
    }

    @Post()
    create() {
        // TODO: Реализовать создание воронки
        // return this.funnelService.create(createFunnelDto);
        return new ResponseDto({
            data: 'Not implemented',
        });
    }

    @Patch(':id')
    update() {
        // TODO: Обновить метаданные воронки (например, название)
        // return this.funnelService.update(id, updateFunnelDto);
        return new ResponseDto({
            data: 'Not implemented',
        });
    }

    @Delete(':id')
    remove() {
        // TODO: Удалить воронку
        // return this.funnelService.remove(id);
        return new ResponseDto({
            data: 'Not implemented',
        });
    }
}
