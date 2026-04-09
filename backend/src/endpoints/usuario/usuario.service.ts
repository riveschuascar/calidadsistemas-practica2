import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }

  async findOne(id: number): Promise<Usuario> {
    return this.usuarioRepository.findOneBy({ ci: id });
  }

  //para usar en el auth.service.ts
  async findByEmail(email: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { email },
      relations: ['rol'],
    });
    if (!usuario) {
      throw new NotFoundException(`No se encontró el usuario con el email ${email}`);
    }
    return usuario;
  }

  async create(usuario: Partial<Usuario>): Promise<Usuario> {
    // Generar el hash de la contraseña antes de guardar
    if (usuario.contrasena) {
      const salt = await bcrypt.genSalt();
      usuario.contrasena = await bcrypt.hash(usuario.contrasena, salt);
    }
    return this.usuarioRepository.save(usuario);
  }

  async update(id: number, usuario: Partial<Usuario>): Promise<void> {
    // Hashear la contraseña si está presente
    if (usuario.contrasena) {
      const salt = await bcrypt.genSalt();
      usuario.contrasena = await bcrypt.hash(usuario.contrasena, salt);
    }
    await this.usuarioRepository.update(id, usuario);
  }

  async updatePartial(id: number, partialData: Partial<Usuario>): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOneBy({ ci: id });

    if (!usuario) {
      throw new NotFoundException(`No se encontró el usuario con ID ${id}`);
    }

    // Validar `rol` si se proporciona
    if (partialData.rol && typeof partialData.rol !== 'number') {
      throw new BadRequestException('El campo rol debe ser un número válido');
    }

    // Hashear la contraseña si está presente
    if (partialData.contrasena) {
      const salt = await bcrypt.genSalt();
      partialData.contrasena = await bcrypt.hash(partialData.contrasena, salt);
    }

    // Actualizar solo los campos proporcionados
    Object.assign(usuario, partialData);

    return this.usuarioRepository.save(usuario);
  }

  async delete(id: number): Promise<void> {
    await this.usuarioRepository.delete(id);
  }

  async migratePasswords(): Promise<void> {
    console.log('Iniciando migración de contraseñas...');
  
    const usuarios = await this.usuarioRepository.find();
    console.log(`Usuarios encontrados: ${usuarios.length}`);
  
    for (const usuario of usuarios) {
      if (!usuario.contrasena.startsWith('$2b$')) {
        console.log(`Migrando contraseña para usuario con ID ${usuario.ci}...`);
  
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(usuario.contrasena, salt);
  
        await this.usuarioRepository.update(usuario.ci, {
          contrasena: hashedPassword,
        });
  
        console.log(`Contraseña migrada correctamente para usuario con ID ${usuario.ci}`);
      } else {
        console.log(`El usuario con ID ${usuario.ci} ya tiene una contraseña hasheada.`);
      }
    }
  
    console.log('Migración de contraseñas completada.');
  }
  
}
