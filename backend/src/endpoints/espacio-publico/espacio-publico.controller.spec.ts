import { Test, TestingModule } from '@nestjs/testing';
import { EspacioPublicoController } from './espacio-publico.controller';
import { EspacioPublicoService } from './espacio-publico.service';

describe('EspacioPublicoController', () => {
  let controller: EspacioPublicoController;

  const mockService = {
    findAll: jest.fn(),
    findByType: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EspacioPublicoController],
      providers: [
        {
          provide: EspacioPublicoService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<EspacioPublicoController>(EspacioPublicoController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // 🔹 TEST 1
  it('debería retornar todos los espacios públicos', async () => {
    const resultado = [{ id: 1 }];
    mockService.findAll.mockResolvedValue(resultado);

    const res = await controller.getAll();

    expect(res).toEqual(resultado);
    expect(mockService.findAll).toHaveBeenCalled();
  });

  // 🔹 TEST 2
  it('debería retornar espacios por tipo', async () => {
    const resultado = [{ id: 1, tipo: 'parque' }];
    mockService.findByType.mockResolvedValue(resultado);

    const res = await controller.getByType('parque');

    expect(res).toEqual(resultado);
    expect(mockService.findByType).toHaveBeenCalledWith('parque');
  });

  // 🔹 TEST 3
  it('debería retornar un espacio por id', async () => {
    const espacio = { id: 1 };
    mockService.findById.mockResolvedValue(espacio);

    const res = await controller.getById(1);

    expect(res).toEqual(espacio);
    expect(mockService.findById).toHaveBeenCalledWith(1);
  });

  // 🔹 TEST 4
  it('debería retornar un espacio por nombre', async () => {
    const espacio = { id: 1, nombre: 'Plaza' };
    mockService.findByName.mockResolvedValue(espacio);

    const res = await controller.getByName('Plaza');

    expect(res).toEqual(espacio);
    expect(mockService.findByName).toHaveBeenCalledWith('Plaza');
  });
});