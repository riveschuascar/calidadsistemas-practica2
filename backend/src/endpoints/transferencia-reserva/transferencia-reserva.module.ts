import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransferenciaReservaService } from './transferencia-reserva.service';
import { TransferenciaReservaController } from './transferencia-reserva.controller';
import { TransferenciaReserva } from './transferencia-reserva.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TransferenciaReserva])],
  providers: [TransferenciaReservaService],
  controllers: [TransferenciaReservaController],
  exports: [TransferenciaReservaService],
})
export class TransferenciaReservaModule {}