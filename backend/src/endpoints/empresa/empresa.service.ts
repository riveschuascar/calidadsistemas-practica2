import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empresa } from './empresa.entity';
import { Usuario } from '../../endpoints/usuario/usuario.entity';

@Injectable()
export class EmpresaService {
  constructor(
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) { }

  async findAll(): Promise<Empresa[]> {
    return this.empresaRepository.find({ relations: ['usuario'] });
  }

  async findOne(id: number): Promise<Empresa> {
    return this.empresaRepository.findOne({ where: { _id: id }, relations: ['usuario'] });
  }

  async create(empresa: Partial<Empresa>): Promise<Empresa> {
    const newEmpresa = this.empresaRepository.create(empresa);
    return this.empresaRepository.save(newEmpresa);
  }
}
