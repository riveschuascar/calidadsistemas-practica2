import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { TarjetasUsuarios } from './tarjetas-usuarios.entity';
import { TarjetasUsuariosService } from './tarjetas-usuarios.service';

@Controller('tarjetas-usuarios')
export class TarjetasUsuariosController {
  constructor(private readonly tarjetaSercive: TarjetasUsuariosService) { }

  @Get('usuario/:ci')
  findByUser(@Param() ci: number) {
    console.log(ci);
    return this.tarjetaSercive.getByUser(ci);
  }

  @Get('tarjeta/:numero')
  findByNumber(@Query() numero: string) {
    console.log(numero);
    return this.tarjetaSercive.getByNumber(numero);
  }

  @Post()
  create(@Body() tarjetaBody: Partial<TarjetasUsuarios>) {
    console.log(tarjetaBody);
    return this.tarjetaSercive.create(tarjetaBody);
  }
}