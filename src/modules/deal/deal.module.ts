import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {DealController} from './deal.controller';
import {DealService} from './deal.service';
import {Deal} from './entities/deal.entity';
import {DealHistory} from './entities/deal-history.entity';
import {SlaLog} from './entities/sla.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Deal, DealHistory, SlaLog])],
    providers: [DealService],
    controllers: [DealController],
})
export class DealModule {}
