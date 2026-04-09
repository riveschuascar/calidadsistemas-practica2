import { Controller, Get , Param, Query } from '@nestjs/common';
import { EspacioPublicoService } from './espacio-publico.service';
import { EspacioPublico } from './espacio-publico.entity';

@Controller('espacios-publicos')
export class EspacioPublicoController {
  constructor(private readonly espacioService: EspacioPublicoService) { }

  @Get()
  async getAll(): Promise<EspacioPublico[]> {
    return this.espacioService.findAll();
  }

  @Get(':tipo')
  async getByType(@Param('tipo') type: string): Promise<EspacioPublico[]> {
    return this.espacioService.findByType(type);
  }

  @Get(':id')
  async getById(@Param('id') id: number): Promise<EspacioPublico> {
    return this.espacioService.findById(id);
  }

  @Get(':nombre')
  async getByName(@Query('nombre') name: string): Promise<EspacioPublico> {
    return this.espacioService.findByName(name);
  }
}
