import {ConfigService} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import {IsEnum, IsNotEmpty, IsOptional, IsString} from 'class-validator';
import {Server, Socket} from 'socket.io';

import {JwtPayload} from '@interfaces/auth.interface';
import {ENV_KEYS_CONFIG} from '~/configs/env';

// Типы событий для задач
export enum TaskEventType {
    SUBSCRIBE = 'SUBSCRIBE',
    UNSUBSCRIBE = 'UNSUBSCRIBE',
}

class TaskEventDto {
    @IsEnum(TaskEventType)
    type: TaskEventType;

    @IsString()
    @IsNotEmpty()
    taskId: string;

    @IsOptional()
    payload?: unknown;
}

@WebSocketGateway()
export class WSGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    afterInit() {
        console.log('WebSocket сервер инициализирован');
    }

    async handleConnection(client: Socket) {
        try {
            const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];

            if (!token) {
                throw new Error('Токен не предоставлен');
            }

            const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
                secret: this.configService.get(ENV_KEYS_CONFIG.JWT_ACCESS_SECRET),
            });

            // 3. Сохраняем данные пользователя прямо в объект сокета
            client.data.user = payload;

            await client.join(`user_${payload.id}`);

            console.log(`Авторизован клиент: ${client.id}, User ID: ${payload.id}`);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Неизвестная ошибка';

            console.log(`Отклонено подключение ${client.id}: ${message}`);
            client.emit('error', {message: 'Unauthorized'});

            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        console.log(`Клиент отключился: ${client.id}`);
    }

    @SubscribeMessage('tasks')
    async handleTasksEvents(@ConnectedSocket() client: Socket, @MessageBody() data: TaskEventDto) {
        // Если передан taskId - комната конкретной задачи, иначе - общая комната задач
        const roomName = data?.taskId ? `task_${data.taskId}` : 'tasks_all';

        switch (data?.type) {
            case TaskEventType.SUBSCRIBE: {
                await client.join(roomName);

                return {status: 'subscribed', room: roomName};
            }
            case TaskEventType.UNSUBSCRIBE: {
                await client.leave(roomName);

                return {status: 'unsubscribed', room: roomName};
            }
            default:
                return 'ok';
        }
    }

    emitToRooms(rooms: string | string[], event: string, payload: unknown) {
        this.server.to(rooms).emit(event, payload);
    }
}
