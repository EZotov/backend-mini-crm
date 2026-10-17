import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {RedisModule} from '@nestjs-modules/ioredis';

import getDBConfig from '../configs/db/options';
import {ActivityModule} from './activity/activity.module';
import {AnalyticsModule} from './analytics/analytics.module';
import {AuthModule} from './auth/auth.module';
import {CompanyModule} from './company/company.module';
import {CustomerModule} from './customer/customer.module';
import {DealModule} from './deal/deal.module';
import {NotificationModule} from './notification/notification.module';
import {UserModule} from './user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRoot({...getDBConfig(), autoLoadEntities: true}),
        RedisModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'single',
                url: configService.get<string>('REDIS_URL'),
                options: {
                    maxRetriesPerRequest: 0,
                    disconnectTimeout: 1000,
                },
            }),
        }),
        CompanyModule,
        CustomerModule,
        UserModule,
        AuthModule,
        ActivityModule,
        AnalyticsModule,
        DealModule,
        NotificationModule,
    ],
    providers: [],
    controllers: [],
})
export class AppModule {}
