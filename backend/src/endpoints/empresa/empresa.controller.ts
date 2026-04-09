import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { Empresa } from '../empresa/empresa.entity';
import { UsuarioService } from '../usuario/usuario.service';

@Controller('empresas')
export class EmpresaController {
  constructor(
    private readonly empresaService: EmpresaService,
    private readonly usuarioService: UsuarioService,
  ) {}

  @Get()
  async findAll(): Promise<Empresa[]> {
    return this.empresaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Empresa> {
    return this.empresaService.findOne(id);
  }

  @Post()
  async create(@Body() body: { ci_usuario: number; empresa: string; documento: Buffer }): Promise<Empresa> {
    const usuario = await this.usuarioService.findOne(body.ci_usuario);

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    const newEmpresa = await this.empresaService.create({
      usuario: usuario,
      empresa: body.empresa,
      documento: body.documento,
    });

    return newEmpresa;
  }
}
