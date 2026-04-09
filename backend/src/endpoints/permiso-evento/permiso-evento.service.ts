import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermisoEvento } from './permiso-evento.entity';

@Injectable()
export class PermisoEventoService {
  constructor(
    @InjectRepository(PermisoEvento)
    private readonly permisoEventoRepository: Repository<PermisoEvento>,
  ) {}

  findAll(): Promise<PermisoEvento[]> {
    return this.permisoEventoRepository.find({
      relations: ['evento', 'permiso'],
    });
  }

  findOne(evento: number, permiso: number): Promise<PermisoEvento> {
    return this.permisoEventoRepository.findOne({
      where: { evento, permiso },
      relations: ['evento', 'permiso'],
    });
  }

  create(data: Partial<PermisoEvento>): Promise<PermisoEvento> {
    const nuevoPermisoEvento = this.permisoEventoRepository.create(data);
    return this.permisoEventoRepository.save(nuevoPermisoEvento);
  }

  async update(
    evento: number,
    permiso: number,
    data: Partial<PermisoEvento>,
  ): Promise<void> {
    await this.permisoEventoRepository.update({ evento, permiso }, data);
  }

  async delete(evento: number, permiso: number): Promise<void> {
    await this.permisoEventoRepository.delete({ evento, permiso });
  }
}
