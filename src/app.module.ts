import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';

import getDBConfig from './configs/db/options';
import {AnalyticsModule} from './modules/analytics/analytics.module';
import {AuthModule} from './modules/auth/auth.module';
import {CustomerModule} from './modules/customer/customer.module';
import {DealModule} from './modules/deal/deal.module';
import {UserModule} from './modules/user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRoot({...getDBConfig(), autoLoadEntities: true}),
        CustomerModule,
        UserModule,
        AuthModule,
        AnalyticsModule,
        DealModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
