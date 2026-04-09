import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { TransferenciaReservaService } from './transferencia-reserva.service';
import { TransferenciaReserva } from './transferencia-reserva.entity';

@Controller('transferencias-reservas')
export class TransferenciaReservaController {
    constructor(
        private readonly transferenciaReservaService: TransferenciaReservaService,
    ) { }

    @Get()
    async findAll(): Promise<TransferenciaReserva[]> {
        return this.transferenciaReservaService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<TransferenciaReserva> {
        return this.transferenciaReservaService.findOne(id);
    }

    @Post()
    async create(@Body() transferenciaReserva: TransferenciaReserva): Promise<TransferenciaReserva> {
        return this.transferenciaReservaService.create(transferenciaReserva);
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() transferenciaReserva: TransferenciaReserva,): Promise<TransferenciaReserva> {
        return this.transferenciaReservaService.update(id, transferenciaReserva);
    }

    // DELETE: Eliminar una transferencia de reserva por su _id
    @Delete(':id')
    async remove(@Param('id') id: number): Promise<void> {
        return this.transferenciaReservaService.delete(id);
    }
}
