import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../common/decorators/roles.decorators';
import { IAuthData } from '../types/auth/auth_data.interface';
import { UserRole } from '../module/user/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // no role restriction
    }

    const request = context.switchToHttp().getRequest<{ user: IAuthData }>();
    const user = request.user;

    if (!user || !user.user_role) {
      throw new ForbiddenException('No role found');
    }

    const hasRole = requiredRoles.includes(user.user_role);
    if (!hasRole) {
      throw new ForbiddenException("You don't have permission.");
    }

    return true;
  }
}
