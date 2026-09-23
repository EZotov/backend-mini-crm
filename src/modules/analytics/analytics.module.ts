import {Module} from '@nestjs/common';

import {AnalyticsController} from './analytics.controller';

@Module({
    providers: [],
    controllers: [AnalyticsController],
})
export class AnalyticsModule {}
