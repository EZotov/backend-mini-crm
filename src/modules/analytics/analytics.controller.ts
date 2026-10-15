import {Controller, Get} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';

import {AuthProtected} from '@decorators/auth.decorator';
import {ResponseDto} from '@dto/api.dto';

@ApiTags('Аналитика')
@AuthProtected()
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
