import { Test, TestingModule } from '@nestjs/testing';
import { TransferenciaReservaController } from './transferencia-reserva.controller';
import { TransferenciaReservaService } from './transferencia-reserva.service';
import { TransferenciaReserva } from './transferencia-reserva.entity';

describe('TransferenciaReservaController', () => {
  let controller: TransferenciaReservaController;
  let service: TransferenciaReservaService;

  const mockTransferenciaReserva: TransferenciaReserva = {
    _id: 1,
    reseva: null,
    usuario_origen: null,
    usuario_destino: null,
  } as TransferenciaReserva;

  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransferenciaReservaController],
      providers: [
        {
          provide: TransferenciaReservaService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<TransferenciaReservaController>(TransferenciaReservaController);
    service = module.get<TransferenciaReservaService>(TransferenciaReservaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of TransferenciaReserva', async () => {
      const expectedResult = [mockTransferenciaReserva];
      mockService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(mockService.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });
});