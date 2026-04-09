import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/modules/auth/auth.module'; 
import { TarjetasUsuarios } from './tarjetas-usuarios.entity';
import { TarjetasUsuariosService } from './tarjetas-usuarios.service';
import { TarjetasUsuariosController } from './tarjetas-usuarios.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TarjetasUsuarios]), forwardRef(() => AuthModule)], // Usa forwardRef aquí si es necesario
  providers: [TarjetasUsuariosService],
  controllers: [TarjetasUsuariosController],
  exports: [TarjetasUsuariosService],
})
export class TarjetasUsuariosModule {}
