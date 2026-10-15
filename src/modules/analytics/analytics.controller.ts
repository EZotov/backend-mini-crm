import {Controller, Get} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';

import {ResponseDto} from '@dto/api.dto';

@ApiTags('Аналитика')
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
