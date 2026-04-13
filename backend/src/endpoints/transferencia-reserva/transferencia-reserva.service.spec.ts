import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransferenciaReservaService } from './transferencia-reserva.service';
import { TransferenciaReserva } from './transferencia-reserva.entity';

describe('TransferenciaReservaService', () => {
  let service: TransferenciaReservaService;
  let repository: Repository<TransferenciaReserva>;

  const mockTransferenciaReserva: TransferenciaReserva = {
    _id: 1,
    reseva: null,
    usuario_origen: null,
    usuario_destino: null,
  } as TransferenciaReserva;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransferenciaReservaService,
        {
          provide: getRepositoryToken(TransferenciaReserva),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TransferenciaReservaService>(TransferenciaReservaService);
    repository = module.get<Repository<TransferenciaReserva>>(getRepositoryToken(TransferenciaReserva));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of TransferenciaReserva', async () => {
      const expectedResult = [mockTransferenciaReserva];
      mockRepository.find.mockResolvedValue(expectedResult);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({ relations: ['reseva', 'usuario_origen', 'usuario_destino'] });
      expect(result).toEqual(expectedResult);
    });
  });
});