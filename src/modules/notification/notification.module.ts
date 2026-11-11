import {Module} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {JwtModule} from '@nestjs/jwt';
import {FileTemplateEngine, MailModule, SmtpTransport} from '@nestjs/mail';
import path from 'path';

import {WSGateway} from './gateways/websocket.gateway';
import {DemoMail} from './mails/demo.mail';
import {NotificationService} from './notification.service';

@Module({
    imports: [
        JwtModule,
        MailModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                transport: new SmtpTransport({
                    host: config.get<string>('MAIL_HOST'),
                    port: parseInt(config.get<string>('MAIL_PORT') as string),
                    secure: true,
                    auth: {
                        user: config.get<string>('MAIL_USER') ?? '',
                        pass: config.get<string>('MAIL_PASS') ?? '',
                    },
                }),
                from: `"minicrm" <${config.get<string>('MAIL_USER')}>`,
                templates: new FileTemplateEngine({
                    dir: path.join(__dirname, 'mails', 'templates'),
                }),
            }),
        }),
    ],
    providers: [NotificationService, WSGateway, DemoMail],
    exports: [NotificationService],
})
export class NotificationModule {}
