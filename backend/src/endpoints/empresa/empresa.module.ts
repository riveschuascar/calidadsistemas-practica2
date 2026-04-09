import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresaService } from './empresa.service';
import { EmpresaController } from './empresa.controller';
import { Empresa } from './empresa.entity';
import { UsuarioService } from '../usuario/usuario.service';
import { Usuario } from '../usuario/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Empresa, Usuario])],
  providers: [EmpresaService, UsuarioService],
  controllers: [EmpresaController],
})
export class EmpresaModule {}
