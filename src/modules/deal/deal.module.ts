import {Module} from '@nestjs/common';

import {DealController} from './deal.controller';

@Module({
    providers: [],
    controllers: [DealController],
})
export class DealModule {}
