import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsuarioModule } from './endpoints/usuario/usuario.module';
import { EventoModule } from './endpoints/evento/evento.module';
import { PresidenteOtbModule } from './endpoints/presidente-otb/presidente_otb.module';
import { EmpresaModule } from './endpoints/empresa/empresa.module';
import { PermisoEventoModule } from './endpoints/permiso-evento/permiso-evento.module';
import { ReservaModule } from './endpoints/reserva/reserva.module';
import { TransferenciaReservaModule } from './endpoints/transferencia-reserva/transferencia-reserva.module';
import { EspacioPublicoModule } from './endpoints/espacio-publico/espacio-publico.module';

@Module({
  imports: [
    // Carga las variables de entorno
    ConfigModule.forRoot({
      isGlobal: true, // Hace que las variables estén disponibles en toda la aplicación
    }),

    // Configuración de TypeORM usando variables de entorno
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: configService.get<'mysql'>('DB_TYPE'),
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: ['query', 'error'],
      }),
    }),

    // Otros módulos
    EmpresaModule,
    EventoModule,
    PermisoEventoModule,
    PresidenteOtbModule,
    ReservaModule,
    TransferenciaReservaModule,
    UsuarioModule,
    EspacioPublicoModule,
  ],
})
export class AppModule {}
