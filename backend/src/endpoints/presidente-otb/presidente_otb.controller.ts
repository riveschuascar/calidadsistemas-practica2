import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PresidenteOtbService } from './presidente_otb.service';
import { PresidenteOtb } from './presidente_otb.entity';

@Controller('presidentes-otb')
export class PresidenteOtbController {
  constructor(private readonly presidenteOtbService: PresidenteOtbService) {}

  @Get()
  async findAll(): Promise<PresidenteOtb[]> {
    return this.presidenteOtbService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<PresidenteOtb> {
    return this.presidenteOtbService.findOne(id);
  }

  @Post()
  async create(@Body() body: { ci_usuario: number; otb: string; documento: Buffer }): Promise<PresidenteOtb> {
    // Buscar el usuario por su ci_usuario en el servicio
    const usuario = await this.presidenteOtbService.findUsuarioByCi(body.ci_usuario);
    
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    return this.presidenteOtbService.create({
      usuario: usuario,  // Aquí pasamos el objeto Usuario completo
      otb: body.otb,
      documento: body.documento,
    });
  }
}
