import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';

import getDBConfig from './configs/db/options';
import {AuthModule} from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({...getDBConfig(), autoLoadEntities: true}),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
