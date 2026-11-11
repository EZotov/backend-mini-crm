import {Injectable, Type} from '@nestjs/common';
import {Mailable, MailableSendOptions, Mailer} from '@nestjs/mail';

import {EventPayload, EventType, WSGateway} from './gateways/websocket.gateway';

@Injectable()
export class NotificationService {
    constructor(
        private readonly wsGateway: WSGateway,
        private readonly mailerService: Mailer,
    ) {}

    /**
     * Отправка личного уведомления пользователю
     */
    sendMessageToUser(userId: string, eventType: EventType, payload: EventPayload) {
        this.wsGateway.emitToRooms(`user_${userId}`, eventType, payload);
    }

    /**
     * Отправка общего уведомления всем подключённым пользователям
     */
    sendMessageToAll(eventType: EventType, payload: EventPayload) {
        this.wsGateway.emitToAll(eventType, payload);
    }

    /**
     * Отправка обновления по конкретной задаче (тем, кто подписался на taskId или на все задачи)
     */
    sendTaskMessage(taskId: string, payload: EventPayload) {
        this.wsGateway.emitToRooms([`task_${taskId}`, 'tasks_all'], 'tasks', {
            ...payload,
            entityId: taskId,
        });
    }

    /**
     * Отправка email сообщения по шаблону
     */
    async sendEmail(to: string, mail: Type<Mailable>, data?: MailableSendOptions<void>['data']): Promise<void> {
        await this.mailerService.send(mail, {
            to,
            data,
        });

        console.log(`Письмо ${mail.name} успешно отправлено на ${to}`);
    }
}
