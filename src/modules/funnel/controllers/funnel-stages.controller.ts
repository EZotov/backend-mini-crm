import {Body, Controller, Delete, Get, Param, Patch, Post, Put} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {plainToInstance} from 'class-transformer';

import {ApiOkModifyResponse} from '@decorators/api-response-swagger.decorator';
import {AuthProtected} from '@decorators/auth.decorator';
import {CollectionResponseDto, CreateResponseDto, ResponseDto} from '@dto/api.dto';
import {ParseUUIDModifyPipe} from '~/utils/pipes/uuid.pipe';

import {
    ChangeOrderFunnelStagesDto,
    CreateFunnelStagesDto,
    FunnelStagesDto,
    UpdateFunnelStagesDto,
} from '../dto/funnel-stages.dto';
import {FunnelStagesService} from '../services/funnel-stages.service';

@ApiTags('Этапы воронки')
@AuthProtected()
@Controller()
export class FunnelStagesController {
    constructor(private readonly funnelStageService: FunnelStagesService) {}

    @ApiOperation({summary: 'Получить список этапов по воронке'})
    @ApiOkModifyResponse(FunnelStagesDto, {isArray: true})
    @Get('funnels/:funnelId/stages')
    async getList(
        @Param('funnelId', ParseUUIDModifyPipe) funnelId: string,
    ): Promise<CollectionResponseDto<FunnelStagesDto>> {
        const {stages, total} = await this.funnelStageService.getList(funnelId);

        return new CollectionResponseDto({
            data: plainToInstance(FunnelStagesDto, stages, {excludeExtraneousValues: true}),
            total,
        });
    }

    @ApiOperation({summary: 'Получить этап воронки по id'})
    @ApiOkModifyResponse(FunnelStagesDto)
    @Get('funnel-stages/:stageId')
    async get(@Param('stageId', ParseUUIDModifyPipe) stageId: string): Promise<ResponseDto<FunnelStagesDto>> {
        const stage = await this.funnelStageService.getById(stageId);

        return new ResponseDto({
            data: plainToInstance(FunnelStagesDto, stage, {excludeExtraneousValues: true}),
        });
    }

    @ApiOperation({summary: 'Создать этап воронки'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Post('/funnels/:funnelId/stages')
    async create(
        @Param('funnelId', ParseUUIDModifyPipe) funnelId: string,
        @Body() dto: CreateFunnelStagesDto,
    ): Promise<ResponseDto<CreateResponseDto>> {
        const createdStageId = await this.funnelStageService.create(funnelId, dto);

        return new ResponseDto({
            data: new CreateResponseDto({
                id: createdStageId,
            }),
        });
    }

    @ApiOperation({summary: 'Редактировать сведения об этапе воронки'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Put('funnel-stages/:stageId')
    async update(@Param('stageId', ParseUUIDModifyPipe) stageId: string, @Body() dto: UpdateFunnelStagesDto) {
        await this.funnelStageService.updateById(stageId, dto);

        return new ResponseDto({
            data: new CreateResponseDto({
                id: stageId,
            }),
        });
    }

    @ApiOperation({summary: 'Изменение порядка этапа воронки'})
    @Patch('funnels/:funnelId/stages/:stageId/order')
    reorder(
        @Param('funnelId', ParseUUIDModifyPipe) funnelId: string,
        @Param('stageId', ParseUUIDModifyPipe) stageId: string,
        @Body() dto: ChangeOrderFunnelStagesDto,
    ): Promise<void> {
        return this.funnelStageService.changeOrder(funnelId, stageId, dto);
    }

    @ApiOperation({summary: 'Удалить этап воронки'})
    @Delete('funnel-stages/:stageId')
    remove(@Param('stageId', ParseUUIDModifyPipe) stageId: string) {
        return this.funnelStageService.removeById(stageId);
    }
}
