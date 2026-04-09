import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EspacioPublico } from './espacio-publico.entity';
import { EspacioPublicoService } from './espacio-publico.service';
import { EspacioPublicoController } from './espacio-publico.controller';

@Module({
    imports: [TypeOrmModule.forFeature([EspacioPublico])],
    providers: [EspacioPublicoService],
    controllers: [EspacioPublicoController],
    exports: [EspacioPublicoService],
})
export class EspacioPublicoModule {}