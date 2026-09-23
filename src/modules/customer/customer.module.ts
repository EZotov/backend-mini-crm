import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {CustomerController} from './customer.controller';
import {CustomerService} from './customer.service';
import {Customer} from './entities/customer.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Customer])],
    providers: [CustomerService],
    controllers: [CustomerController],
})
export class CustomerModule {}
