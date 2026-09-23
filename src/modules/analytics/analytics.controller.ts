import {Controller, Get} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';

@ApiTags('Аналитика')
@Controller('analytics')
export class AnalyticsController {
    @ApiOperation({summary: 'Получить сводку аналитики'})
    @Get('summary')
    getSummary() {
        return 'Not implemented';
    }
}
