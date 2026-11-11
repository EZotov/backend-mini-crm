import {Injectable} from '@nestjs/common';

import {WSGateway} from './gateways/websocket.gateway';

@Injectable()
export class NotificationService {
    constructor(private readonly wsGateway: WSGateway) {}

    // Отправка личного общего уведомления пользователю (работает сразу после авторизации)
    sendGeneralMessageToUser(userId: string, payload: unknown) {
        this.wsGateway.emitToRooms(`user_${userId}`, 'general', payload);
    }

    // Отправка обновления по конкретной задаче (тем, кто подписался на taskId или на все задачи)
    sendTaskUpdateMessage(taskId: string, payload: Record<string, unknown>) {
        this.wsGateway.emitToRooms([`task_${taskId}`, 'tasks_all'], 'tasks', {taskId, ...payload});
    }
}
