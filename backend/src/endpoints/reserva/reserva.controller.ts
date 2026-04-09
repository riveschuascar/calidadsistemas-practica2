// reserva.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { Reserva } from './reserva.entity';

@Controller('reservas')
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) { }

  @Get()
  findAll(): Promise<Reserva[]> {
    return this.reservaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Reserva> {
    return this.reservaService.findOne(id);
  }

  @Post()
  create(@Body() reservaData: Partial<Reserva>): Promise<Reserva> {
    return this.reservaService.create(reservaData);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() reservaData: Partial<Reserva>): Promise<void> {
    return this.reservaService.update(id, reservaData);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.reservaService.delete(id);
  }
}
