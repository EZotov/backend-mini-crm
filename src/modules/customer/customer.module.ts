import {Module} from '@nestjs/common';

import {CustomerController} from './customer.controller';

@Module({
    providers: [],
    controllers: [CustomerController],
})
export class CustomerModule {}
