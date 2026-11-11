import {Injectable} from '@nestjs/common';
import type {Mailable} from '@nestjs/mail';

interface DemoData {
    userName: string;
    actionUrl: string;
}

@Injectable()
export class DemoMail implements Mailable<DemoData> {
    render(data: DemoData) {
        return {
            subject: `${data.userName}, Demo`,
            template: 'demo',
            context: {
                userName: data.userName,
                actionUrl: data.actionUrl,
            },
        };
    }
}
