import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PermisoEventoService } from './permiso-evento.service';
import { PermisoEvento } from './permiso-evento.entity';

@Controller('permisos-eventos')
export class PermisoEventoController {
  constructor(private readonly permisoEventoService: PermisoEventoService) {}

  @Get()
  findAll(): Promise<PermisoEvento[]> {
    return this.permisoEventoService.findAll();
  }

  @Get(':evento/:permiso')
  findOne(
    @Param('evento') evento: number,
    @Param('permiso') permiso: number,
  ): Promise<PermisoEvento> {
    return this.permisoEventoService.findOne(evento, permiso);
  }

  @Post()
  create(@Body() data: Partial<PermisoEvento>): Promise<PermisoEvento> {
    return this.permisoEventoService.create(data);
  }

  @Put(':evento/:permiso')
  async update(
    @Param('evento') evento: number,
    @Param('permiso') permiso: number,
    @Body() data: Partial<PermisoEvento>,
  ): Promise<void> {
    await this.permisoEventoService.update(evento, permiso, data);
  }

  @Delete(':evento/:permiso')
  delete(
    @Param('evento') evento: number,
    @Param('permiso') permiso: number,
  ): Promise<void> {
    return this.permisoEventoService.delete(evento, permiso);
  }
}
