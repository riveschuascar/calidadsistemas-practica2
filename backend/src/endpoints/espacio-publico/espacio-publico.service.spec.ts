import { Test, TestingModule } from '@nestjs/testing';
import { EspacioPublicoService } from './espacio-publico.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EspacioPublico } from './espacio-publico.entity';

describe('EspacioPublicoService', () => {
  let service: EspacioPublicoService;

  const mockRepository = {
    find: jest.fn(),
    findBy: jest.fn(),
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EspacioPublicoService,
        {
          provide: getRepositoryToken(EspacioPublico),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<EspacioPublicoService>(EspacioPublicoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  
  it('debería retornar todos los espacios públicos', async () => {
    const resultado = [{ id: 1 }];
    mockRepository.find.mockResolvedValue(resultado);

    const res = await service.findAll();

    expect(res).toEqual(resultado);
    expect(mockRepository.find).toHaveBeenCalled();
  });

  
  it('debería filtrar por tipo', async () => {
    const resultado = [{ id: 1, tipo: 'parque' }];
    mockRepository.findBy.mockResolvedValue(resultado);

    const res = await service.findByType('parque');

    expect(res).toEqual(resultado);
    expect(mockRepository.findBy).toHaveBeenCalledWith({
      tipo: 'parque',
    });
  });

  
  it('debería retornar un espacio por id', async () => {
    const espacio = { id: 1 };
    mockRepository.findOneBy.mockResolvedValue(espacio);

    const res = await service.findById(1);

    expect(res).toEqual(espacio);
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({
      _id: 1,
    });
  });

  
  it('debería filtrar por nombre', async () => {
    const espacio = { id: 1, nombre: 'Plaza' };
    mockRepository.findOneBy.mockResolvedValue(espacio);

    const res = await service.findByName('Plaza');

    expect(res).toEqual(espacio);
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({
      nombre: 'Plaza',
    });
  });
});