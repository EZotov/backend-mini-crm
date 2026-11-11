import {Injectable, Type} from '@nestjs/common';
import {Mailable, MailableSendOptions, Mailer} from '@nestjs/mail';

import {WSGateway} from './gateways/websocket.gateway';

@Injectable()
export class NotificationService {
    constructor(
        private readonly wsGateway: WSGateway,
        private readonly mailerService: Mailer,
    ) {}

    // Отправка личного общего уведомления пользователю (работает сразу после авторизации)
    sendGeneralMessageToUser(userId: string, payload: unknown) {
        this.wsGateway.emitToRooms(`user_${userId}`, 'general', payload);
    }

    // Отправка обновления по конкретной задаче (тем, кто подписался на taskId или на все задачи)
    sendTaskUpdateMessage(taskId: string, payload: Record<string, unknown>) {
        this.wsGateway.emitToRooms([`task_${taskId}`, 'tasks_all'], 'tasks', {taskId, ...payload});
    }

    // Отправка email сообщения по шаблону
    async sendEmail(to: string, mail: Type<Mailable>, data?: MailableSendOptions<void>['data']): Promise<void> {
        await this.mailerService.send(mail, {
            to,
            data,
        });

        console.log(`Письмо ${mail.name} успешно отправлено на ${to}`);
    }
}
