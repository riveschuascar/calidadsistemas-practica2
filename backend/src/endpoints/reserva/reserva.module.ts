import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservaService } from './reserva.service';
import { ReservaController } from './reserva.controller';
import { Reserva } from './reserva.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva])],
  providers: [ReservaService],
  controllers: [ReservaController],
  exports: [ReservaService],
})
export class ReservaModule {}
