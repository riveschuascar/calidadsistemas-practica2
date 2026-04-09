import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtener los roles definidos en el decorador @Roles
    const roles = this.reflector.get<number[]>('roles', context.getHandler());
    if (!roles) {
      // Si no hay roles definidos, permitir acceso
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // user debería haberse establecido en el AuthGuard

    console.log('Usuario autenticado:', user);
    console.log('Roles permitidos:', roles);
    if (!user || typeof user.id_rol !== 'number') {
      throw new ForbiddenException('Usuario no autenticado o rol inválido');
    }

    // Verificar si el rol del usuario está incluido en los roles permitidos
    if (!roles.includes(user.id_rol)) {
      throw new ForbiddenException('No tienes permiso para acceder a este recurso');
    }

    return true; // El usuario tiene un rol permitido
  }
}
