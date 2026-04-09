import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransferenciaReserva } from './transferencia-reserva.entity';

@Injectable()
export class TransferenciaReservaService {
  constructor(
    @InjectRepository(TransferenciaReserva)
    private readonly reservaRepository: Repository<TransferenciaReserva>,
  ) { }

  async findAll(): Promise<TransferenciaReserva[]> {
    return this.reservaRepository.find({ relations: ['reseva', 'usuario_origen', 'usuario_destino'] });
  }

  async findOne(id: number): Promise<TransferenciaReserva> {
    return this.reservaRepository.findOne({ where: { _id: id }, relations: ['reseva', 'usuario_origen', 'usuario_destino'], });
  }

  async create(transferencia: Partial<TransferenciaReserva>): Promise<TransferenciaReserva> {
    return this.reservaRepository.save(transferencia);
  }

  async update(id: number, transferencia: Partial<TransferenciaReserva>): Promise<TransferenciaReserva> {
    await this.reservaRepository.update(id, transferencia);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.reservaRepository.delete(id);
  }
}