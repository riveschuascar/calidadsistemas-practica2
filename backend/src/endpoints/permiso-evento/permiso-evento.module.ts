import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermisoEvento } from './permiso-evento.entity';
import { PermisoEventoService } from './permiso-evento.service';
import { PermisoEventoController } from './permiso-evento.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PermisoEvento])],
  providers: [PermisoEventoService],
  controllers: [PermisoEventoController],
})
export class PermisoEventoModule {}
