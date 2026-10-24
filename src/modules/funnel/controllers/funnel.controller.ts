import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';

import {ApiOkModifyResponse} from '@decorators/api-response-swagger.decorator';
import {AuthProtected} from '@decorators/auth.decorator';
import {CollectionResponseDto, CreateResponseDto, ResponseDto} from '@dto/api.dto';
import {ParseUUIDModifyPipe} from '~/utils/pipes/uuid.pipe';

import {CreateFunnelDto, UpdateFunnelDto} from '../dto/funnel.dto';
import {Funnel} from '../entities/funnel.entity';
import {FunnelService} from '../services/funnel.service';

@ApiTags('Воронки')
@AuthProtected()
@Controller('funnels')
export class FunnelController {
    constructor(private readonly funnelService: FunnelService) {}

    @ApiOkModifyResponse(Funnel, {isArray: true})
    @Get()
    async findAll(): Promise<CollectionResponseDto<Funnel>> {
        const {funnels, total} = await this.funnelService.getList();

        return new CollectionResponseDto({
            data: funnels,
            total,
        });
    }

    @ApiOkModifyResponse(Funnel)
    @Get(':id')
    async findOne(@Param('id', ParseUUIDModifyPipe) id: string) {
        const funnel = await this.funnelService.getById(id);

        return new ResponseDto({
            data: funnel,
        });
    }

    @ApiOkModifyResponse(CreateResponseDto)
    @Post()
    async create(@Body() dto: CreateFunnelDto): Promise<ResponseDto<CreateResponseDto>> {
        const createdFunnelId = await this.funnelService.create(dto);

        return new ResponseDto({
            data: new CreateResponseDto({
                id: createdFunnelId,
            }),
        });
    }

    @ApiOkModifyResponse(CreateResponseDto)
    @Put(':id')
    async update(@Param('id', ParseUUIDModifyPipe) id: string, @Body() dto: UpdateFunnelDto) {
        const updatedFunnelId = await this.funnelService.updateById(id, dto);

        return new ResponseDto({
            data: new CreateResponseDto({
                id: updatedFunnelId,
            }),
        });
    }

    @Delete(':id')
    remove(@Param('id', ParseUUIDModifyPipe) id: string): Promise<void> {
        return this.funnelService.removeById(id);
    }
}
