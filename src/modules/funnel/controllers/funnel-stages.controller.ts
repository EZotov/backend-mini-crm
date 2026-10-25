import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
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
@Controller('funnel-stages')
export class FunnelStagesController {
    constructor(private readonly funnelStageService: FunnelStagesService) {}

    @ApiOperation({summary: 'Получить список этапов по воронке'})
    @ApiOkModifyResponse(FunnelStagesDto, {isArray: true})
    @Get('by-funnel/:funnelId')
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
    @Get(':stageId')
    async get(@Param('stageId', ParseUUIDModifyPipe) stageId: string): Promise<ResponseDto<FunnelStagesDto>> {
        const stage = await this.funnelStageService.getById(stageId);

        return new ResponseDto({
            data: plainToInstance(FunnelStagesDto, stage, {excludeExtraneousValues: true}),
        });
    }

    @ApiOperation({summary: 'Создать этап воронки'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Post()
    async create(@Body() dto: CreateFunnelStagesDto): Promise<ResponseDto<CreateResponseDto>> {
        const createdStageId = await this.funnelStageService.create(dto);

        return new ResponseDto({
            data: new CreateResponseDto({
                id: createdStageId,
            }),
        });
    }

    @ApiOperation({summary: 'Редактировать сведения об этапе воронки'})
    @ApiOkModifyResponse(CreateResponseDto)
    @Put(':stageId')
    async update(@Param('stageId', ParseUUIDModifyPipe) stageId: string, @Body() dto: UpdateFunnelStagesDto) {
        await this.funnelStageService.updateById(stageId, dto);

        return new ResponseDto({
            data: new CreateResponseDto({
                id: stageId,
            }),
        });
    }

    @ApiOperation({summary: 'Изменение порядка этапа воронки'})
    @Post(':stageId/reorder')
    reorder(
        @Param('stageId', ParseUUIDModifyPipe) stageId: string,
        @Body() dto: ChangeOrderFunnelStagesDto,
    ): Promise<void> {
        return this.funnelStageService.changeOrder(stageId, dto);
    }

    @ApiOperation({summary: 'Удалить этап воронки'})
    @Delete(':stageId')
    remove(@Param('stageId', ParseUUIDModifyPipe) stageId: string) {
        return this.funnelStageService.removeById(stageId);
    }
}
