import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { TarjetasUsuariosService } from './tarjetas-usuarios.service';
import { TarjetasUsuarios } from './tarjetas-usuarios.entity';

describe('TarjetasUsuariosService', () => {
  let service: TarjetasUsuariosService;
  let repository: Repository<TarjetasUsuarios>;

  const mockTarjetaUsuario: TarjetasUsuarios = {
    usuario: 1,
    numero_tarjeta: '1234567890123456',
    cvc: '123',
    saldo: 100,
    caducidad: '2030-12-31',
  } as TarjetasUsuarios;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    findBy: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TarjetasUsuariosService,
        {
          provide: getRepositoryToken(TarjetasUsuarios),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TarjetasUsuariosService>(TarjetasUsuariosService);
    repository = module.get<Repository<TarjetasUsuarios>>(getRepositoryToken(TarjetasUsuarios));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getByNumber', () => {
    it('should return a tarjeta by numero_tarjeta', async () => {
      const expected = { ...mockTarjetaUsuario };
      mockRepository.findOneBy.mockResolvedValue(expected);

      const result = await service.getByNumber(mockTarjetaUsuario.numero_tarjeta);

      expect(result).toBe(expected);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ numero_tarjeta: mockTarjetaUsuario.numero_tarjeta });
    });
  });
});