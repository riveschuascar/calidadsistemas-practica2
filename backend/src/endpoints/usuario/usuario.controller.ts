import { Controller, Get, Post, Put, Patch, Delete, Body, Param, BadRequestException, InternalServerErrorException, UseGuards } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from './usuario.entity';
import { AuthGuard } from '../../modules/auth/guard/auth.guard';  // Importa el AuthGuard
import { RolesGuard } from '../../modules/auth/roles/roles.guard';   // Importa el RolesGuard
import { Roles } from '../../modules/auth/roles/roles.decorator';   // Importa el decorador personalizado de roles


@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) { }

  @Get()
  @UseGuards(AuthGuard)
  findAll(): Promise<Usuario[]> {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: number): Promise<Usuario> {
    return this.usuarioService.findOne(id);
  }

  @Post()
  async create(@Body() usuarioData: Partial<Usuario>): Promise<Usuario> {
    try {
      usuarioData.nombre = usuarioData.nombre || 'Usuario temporal';
      usuarioData.ap_paterno = usuarioData.ap_paterno || 'Apellido temporal';
      usuarioData.ap_materno = usuarioData.ap_materno || 'Apellido temporal';
      usuarioData.direccion = usuarioData.direccion || 'Sin dirección';
      usuarioData.telefono = usuarioData.telefono || 'Sin teléfono';

      return await this.usuarioService.create(usuarioData);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('El email o CI ya está registrado');
      }
      console.error('Error al crear el usuario:', error);
      throw new InternalServerErrorException(
        'Ocurrió un error al crear el usuario',
      );
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(1)
  update(@Param('id') id: number, @Body() usuarioData: Partial<Usuario>): Promise<void> {
    return this.usuarioService.update(id, usuarioData);
  }

  @Patch(':id')
  async updatePartial(
    @Param('id') id: number,
    @Body() partialData: Partial<Usuario>,
  ): Promise<Usuario> {
    if (Number.isNaN(id)) {
      throw new BadRequestException('El ID proporcionado no es válido');
    }

    try {
      const updatedUser = await this.usuarioService.updatePartial(id, partialData);
      return updatedUser;
    } catch (error) {
      console.error(`Error al actualizar parcialmente el usuario con ID ${id}:`, error);
      throw new InternalServerErrorException(
        `Error al actualizar parcialmente el usuario con ID ${id}`,
      );
    }
  }

  // Ruta protegida: solo usuarios autenticados y con rol 'admin'
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)  // Protege con AuthGuard y RolesGuard
  @Roles(1)  // Solo los 'admin' pueden acceder
  delete(@Param('id') id: number): Promise<void> {
    return this.usuarioService.delete(id);
  }

  @Patch('migrate-passwords')
  @UseGuards(AuthGuard)
  async migratePasswords(): Promise<string> {
    console.log('Llamando a migratePasswords en el servicio...');
    await this.usuarioService.migratePasswords();
    return 'Migración de contraseñas completada.';
  }

}