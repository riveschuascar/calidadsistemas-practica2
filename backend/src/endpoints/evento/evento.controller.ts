import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { EventoService } from './evento.service';
import { Evento } from '../evento/evento.entity';

@Controller('eventos')
export class EventoController {
  constructor(private readonly eventoService: EventoService) {}

  @Get()
  async findAll(): Promise<Evento[]> {
    return this.eventoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Evento> {
    return this.eventoService.findOne(id);
  }

  @Post()
  async create(
    @Body()
    body: {
      id_reserva: number;
      id_tipo_evento: number;
      nombre: string;
      descripcion: string;
      fecha_evento: Date;
    },
  ): Promise<Evento> {
    return this.eventoService.create(body); // Pasa los datos tal cual
  }
  

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.eventoService.delete(id);
  }
}
