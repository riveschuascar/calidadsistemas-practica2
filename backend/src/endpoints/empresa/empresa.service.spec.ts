import { Test, TestingModule } from '@nestjs/testing';
import { EmpresaService } from './empresa.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Empresa } from './empresa.entity';
import { Usuario } from '../usuario/usuario.entity';

describe('EmpresaService', () => {
  let service: EmpresaService;

  const mockEmpresaRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
};

  const mockUsuarioRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmpresaService,
        {
          provide: getRepositoryToken(Empresa),
          useValue: mockEmpresaRepository,
        },
        {
          provide: getRepositoryToken(Usuario), // 👈 SOLUCIÓN
          useValue: mockUsuarioRepository,
        },
      ],
    }).compile();

    service = module.get<EmpresaService>(EmpresaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería retornar todas las empresas', async () => {
    const resultado = [{ id: 1, nombre: 'Empresa Test' }];
    mockEmpresaRepository.find.mockResolvedValue(resultado);

    const res = await service.findAll();

    expect(res).toEqual(resultado);
    expect(mockEmpresaRepository.find).toHaveBeenCalled();
  });

  it('debería retornar una empresa por id', async () => {
    const empresa = { id: 1, nombre: 'Empresa Test' };
    mockEmpresaRepository.findOne.mockResolvedValue(empresa);

    const res = await service.findOne(1);

    expect(res).toEqual(empresa);
    expect(mockEmpresaRepository.findOne).toHaveBeenCalled();
  });

  it('debería crear y guardar una empresa', async () => {
  const nuevaEmpresa = { nombre: 'Nueva Empresa' };

  const empresaCreada = { ...nuevaEmpresa }; // lo que retorna create
  const empresaGuardada = { id: 1, ...nuevaEmpresa }; // lo que retorna save

  mockEmpresaRepository.create.mockReturnValue(empresaCreada);
  mockEmpresaRepository.save.mockResolvedValue(empresaGuardada);

  const res = await service.create(nuevaEmpresa as any);

  expect(res).toEqual(empresaGuardada);
  expect(mockEmpresaRepository.create).toHaveBeenCalledWith(nuevaEmpresa);
  expect(mockEmpresaRepository.save).toHaveBeenCalledWith(empresaCreada);
});
});