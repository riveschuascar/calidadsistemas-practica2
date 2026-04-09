import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PresidenteOtb } from './presidente_otb.entity';
import { Usuario } from '../usuario/usuario.entity';

@Injectable()
export class PresidenteOtbService {
constructor(
  @InjectRepository(PresidenteOtb)
  private readonly presidenteOtbRepository: Repository<PresidenteOtb>,
  @InjectRepository(Usuario)
  private readonly usuarioRepository: Repository<Usuario>,
) {}

  async findAll(): Promise<PresidenteOtb[]> {
    return this.presidenteOtbRepository.find({ relations: ['usuario'] });
  }

  async findOne(id: number): Promise<PresidenteOtb> {
    return this.presidenteOtbRepository.findOne({ where: { _id: id }, relations: ['usuario'], });
  }

  async findUsuarioByCi(ci_usuario: number): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({ where: { ci : ci_usuario } });
  }

  async create(presidenteOtbData: Partial<PresidenteOtb>): Promise<PresidenteOtb> {
    const newPresidenteOtb = this.presidenteOtbRepository.create({
      usuario: presidenteOtbData.usuario,  // Aquí pasamos el objeto Usuario
      otb: presidenteOtbData.otb,
      documento: presidenteOtbData.documento,
    });

    return this.presidenteOtbRepository.save(newPresidenteOtb);
  }

  async delete(id: number): Promise<void> {
    await this.presidenteOtbRepository.delete(id);
  }
}
