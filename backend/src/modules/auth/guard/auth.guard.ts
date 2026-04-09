import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { url } = request;

    // esta webada esta hardcodeada para migrar las contrasenias para que funcione jwt
    //if (url === '/usuarios/migrate-passwords') {
    //console.log('Acceso permitido: ruta pública migrate-passwords.');
    //return true;
    //}

    // Permitir acceso público al endpoint de login
    if (url === '/auth/login') {
      console.log('Acceso permitido: ruta pública login.');
      return true; // No requiere autenticación
    }

    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No se ha proporcionado el token');
    }

    try {
      const user = await this.jwtService.verifyAsync(token);
      request.user = user; // Adjuntar el usuario al request
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('El token ha expirado');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token inválido');
      }

      // Para otros errores, lanzar una excepción generica
      throw new UnauthorizedException('Error de autenticación');
    }

    return true;
  }
}
