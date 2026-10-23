import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {FunnelController} from './controllers/funnel.controller';
import {FunnelStagesController} from './controllers/funnel-stages.controller';
import {Funnel} from './entities/funnel.entity';
import {FunnelStages} from './entities/funnel-stages.entity';
import {FunnelService} from './services/funnel.service';
import {FunnelStagesService} from './services/funnel-stages.service';

@Module({
    imports: [TypeOrmModule.forFeature([Funnel, FunnelStages])],
    providers: [FunnelService, FunnelStagesService],
    controllers: [FunnelController, FunnelStagesController],
})
export class FunnelModule {}
