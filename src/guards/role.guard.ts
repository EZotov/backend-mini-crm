import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    SetMetadata,
    UnauthorizedException,
} from '@nestjs/common';
import {Reflector} from '@nestjs/core';

import {ROLES} from '@consts/index';
import {AuthenticatedRequest} from '@interfaces/auth.interface';

export const Roles = (...roles: (keyof typeof ROLES)[]) => SetMetadata('roles', roles);

@Injectable()
export class RoleAccessGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext) {
        const requiredRoles = this.reflector.getAllAndOverride<(keyof typeof ROLES)[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles?.length) {
            return true;
        }

        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

        if (!request?.user) {
            throw new UnauthorizedException('Пользователь не авторизован');
        }

        const {role = ''} = request.user;

        if (!requiredRoles.includes(role as keyof typeof ROLES)) {
            throw new ForbiddenException('Недостаточно прав для выполнения операции');
        }

        return true;
    }
}
