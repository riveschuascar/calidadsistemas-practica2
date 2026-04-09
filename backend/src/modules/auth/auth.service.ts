import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuarioService } from 'src/endpoints/usuario/usuario.service'; 

@Injectable()
export class AuthService {
    constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
    ) {}

    async validateUser(email: string, contrasena: string): Promise<any> {
    const user = await this.usuarioService.findByEmail(email);
    if (user && (await bcrypt.compare(contrasena, user.contrasena))) {
        const { contrasena, ...result } = user; // Excluir la contraseña
        return result;
    }
    throw new UnauthorizedException('Credenciales inválidas');
    }

    async login(user: any) {
        const payload = {
            email: user.email,
            id_rol: user.rol._id,
            rol: user.rol.rol,
        };
    return {
        access_token: this.jwtService.sign(payload),
    };
    }
}
