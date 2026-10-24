import {Body, Controller, Delete, Get, Patch, Post, Put} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';

import {AuthProtected} from '@decorators/auth.decorator';
import {ResponseDto} from '@dto/api.dto';

@ApiTags('Этапы воронки')
@AuthProtected()
@Controller('/funnels/:id/funnels-stages')
export class FunnelStagesController {
    @Get()
    findAll() {
        // TODO: Получить все этапы для конкретной воронки (отсортированные по order)
        // return this.funnelService.findStagesByFunnel(funnelId);
        return new ResponseDto({
            data: 'Not implemented',
        });
    }

    @Post()
    create() {
        // TODO: Добавить новый этап в конкретную воронку
        // return this.funnelService.addStage(funnelId, createStageDto);
        return new ResponseDto({
            data: 'Not implemented',
        });
    }

    @Put('reorder')
    reorder() {
        // PUT используется для полного обновления коллекции/порядка.
        // TODO: Изменить порядок этапов (drag-and-drop на фронтенде)
        // return this.funnelService.reorderStages(funnelId, reorderStagesDto);
        return new ResponseDto({
            data: 'Not implemented',
        });
    }

    @Patch(':stageId')
    update() {
        // TODO: Обновить конкретный этап (название, цвет и т.д.)
        // return this.funnelService.updateStage(funnelId, stageId, updateStageDto);
        return new ResponseDto({
            data: 'Not implemented',
        });
    }

    @Delete(':stageId')
    remove() {
        // TODO: Удалить этап из воронки (с валидацией, нет ли там активных сделок)
        // return this.funnelService.removeStage(funnelId, stageId);
        return new ResponseDto({
            data: 'Not implemented',
        });
    }
}
