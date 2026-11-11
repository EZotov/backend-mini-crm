import {Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';

import {WSGateway} from './gateways/websocket.gateway';
import {NotificationService} from './notification.service';

@Module({
    imports: [JwtModule],
    providers: [NotificationService, WSGateway],
    exports: [NotificationService],
})
export class NotificationModule {}
