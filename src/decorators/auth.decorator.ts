import {applyDecorators, UseGuards} from '@nestjs/common';

import {ROLES} from '@consts/index';
import {JwtAuthGuard} from '@guards/auth.guard';
import {RoleAccessGuard, Roles} from '@guards/role.guard';

/**
 * Декоратор защиты роутов аутентификацией и авторизацией
 * @param roles доступные роли, если не указаны - пропускает все
 * @returns
 */
export function AuthProtected(...roles: (keyof typeof ROLES)[]) {
    return applyDecorators(
        // 1. Сначала железно вешаем проверку JWT
        UseGuards(JwtAuthGuard),
        // 2. Вешаем гвард проверки ролей
        UseGuards(RoleAccessGuard),
        // 3. Передаем список разрешенных ролей в метаданные
        Roles(...roles),
    );
}
