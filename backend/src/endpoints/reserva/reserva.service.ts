import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from './reserva.entity';

@Injectable()
export class ReservaService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
  ) { }

  async findAll(): Promise<Reserva[]> {
    return this.reservaRepository.find({ relations: ['usuario', 'espacio_publico'] });
  }

  async findOne(id: number): Promise<Reserva> {
    return this.reservaRepository.findOne({ where: { _id: id }, relations: ['usuario', 'espacio_publico'], });
  }

  async create(reserva: Partial<Reserva>): Promise<Reserva> {
    return this.reservaRepository.save(reserva);
  }

  async update(id: number, reserva: Partial<Reserva>): Promise<void> {
    await this.reservaRepository.update(id, reserva);
  }

  async delete(id: number): Promise<void> {
    await this.reservaRepository.delete(id);
  }
}
