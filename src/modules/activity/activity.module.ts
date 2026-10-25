import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {DealModule} from '../deal/deal.module';
import {UserModule} from '../user/user.module';
import {ActivityController} from './activity.controller';
import {ActivityService} from './activity.service';
import {Activity} from './entities/activity.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Activity]), UserModule, DealModule],
    providers: [ActivityService],
    controllers: [ActivityController],
})
export class ActivityModule {}
