import { Injectable } from '@nestjs/common';
import { UsuarioService } from './endpoints/usuario/usuario.service'; 

@Injectable()
export class AppService {
  constructor(private readonly usuarioService: UsuarioService) {}

  getHello(): string {
    return 'Hello World!';
  }

}
