import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evento } from './evento.entity';
import { Reserva } from '../reserva/reserva.entity';
import { TipoEvento } from '../tipo-evento/tipo-evento.entity';

@Injectable()
export class EventoService {
  constructor(
    @InjectRepository(Evento)
    private readonly eventoRepository: Repository<Evento>,
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
    @InjectRepository(TipoEvento)
    private readonly tipoEventoRepository: Repository<TipoEvento>,
  ) { }

  async findAll(): Promise<Evento[]> {
    return this.eventoRepository.find({ relations: ['id_reserva', 'id_tipo_evento'] });
  }

  async findOne(id: number): Promise<Evento> {
    return this.eventoRepository.findOne({ where: { _id: id }, relations: ['id_reserva', 'id_tipo_evento'] });
  }

  async create(eventoData: {
    id_reserva: number;
    id_tipo_evento: number;
    nombre: string;
    descripcion: string;
    fecha_evento: Date;
  }): Promise<Evento> {
    const reserva = await this.reservaRepository.findOne({ where: { _id: eventoData.id_reserva } });
    const tipoEvento = await this.tipoEventoRepository.findOne({ where: { _id: eventoData.id_tipo_evento } });

    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }

    if (!tipoEvento) {
      throw new Error('Tipo de evento no encontrado');
    }

    const newEvento = this.eventoRepository.create({
      reserva: reserva,
      tipo_evento: tipoEvento,
      nombre: eventoData.nombre,
      descripcion: eventoData.descripcion,
      fecha_evento: eventoData.fecha_evento,
    });

    return this.eventoRepository.save(newEvento);
  }


  async delete(id: number): Promise<void> {
    await this.eventoRepository.delete(id);
  }
}
