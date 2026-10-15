import {Controller, Get, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';

import {ResponseDto} from '@dto/api.dto';
import {JwtAuthGuard} from '@guards/auth.guard';

@ApiTags('Аналитика')
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
    @ApiOperation({summary: 'Получить сводку аналитики'})
    @Get('summary')
    getSummary(): ResponseDto<string> {
        return new ResponseDto({
            data: 'Not implemented',
        });
    }
}
