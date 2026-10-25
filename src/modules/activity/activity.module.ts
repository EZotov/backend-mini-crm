import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {DealHistoryService} from '../deal/services/deal-history.service';
import {UserService} from '../user/services/user.service';
import {ActivityController} from './activity.controller';
import {ActivityService} from './activity.service';
import {Activity} from './entities/activity.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Activity])],
    providers: [ActivityService, UserService, DealHistoryService],
    controllers: [ActivityController],
})
export class ActivityModule {}
