import {Injectable} from '@nestjs/common';
import type {Mailable} from '@nestjs/mail';

@Injectable()
export class DemoMail implements Mailable {
    render(props) {
        return {
            subject: `${props.userName}, Demo`,
            template: 'demo',
            context: {
                userName: props.userName,
                resetLink: props.resetLink,
            },
        };
    }
}
