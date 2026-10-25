import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {UserModule} from '../user/user.module';
import {DealController} from './deal.controller';
import {Deal} from './entities/deal.entity';
import {DealHistory} from './entities/deal-history.entity';
import {SlaLog} from './entities/sla.entity';
import {DealService} from './services/deal.service';
import {DealHistoryService} from './services/deal-history.service';

@Module({
    imports: [TypeOrmModule.forFeature([Deal, DealHistory, SlaLog]), UserModule],
    providers: [DealService, DealHistoryService],
    controllers: [DealController],
    exports: [DealHistoryService],
})
export class DealModule {}
