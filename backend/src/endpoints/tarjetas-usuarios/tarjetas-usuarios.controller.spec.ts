import { Test, TestingModule } from '@nestjs/testing';
import { TarjetasUsuariosController } from './tarjetas-usuarios.controller';
import { TarjetasUsuariosService } from './tarjetas-usuarios.service';
import { TarjetasUsuarios } from './tarjetas-usuarios.entity';

describe('TarjetasUsuariosController', () => {
  let controller: TarjetasUsuariosController;
  let service: TarjetasUsuariosService;

  const mockTarjetaUsuario: TarjetasUsuarios = {
    usuario: 1,
    numero_tarjeta: '1234567890123456',
    cvc: '123',
    saldo: 100,
    caducidad: '2030-12-31',
  } as TarjetasUsuarios;

  const mockService = {
    getByUser: jest.fn(),
    getByNumber: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TarjetasUsuariosController],
      providers: [
        {
          provide: TarjetasUsuariosService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<TarjetasUsuariosController>(TarjetasUsuariosController);
    service = module.get<TarjetasUsuariosService>(TarjetasUsuariosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findByUser', () => {
    it('should return tarjetas for a user', async () => {
      const expected = [{ ...mockTarjetaUsuario }];
      mockService.getByUser.mockResolvedValue(expected);

      const result = await controller.findByUser(1);

      expect(result).toBe(expected);
      expect(mockService.getByUser).toHaveBeenCalledWith(1);
    });
  });

  describe('findByNumber', () => {
    it('should return a tarjeta by number', async () => {
      const expected = { ...mockTarjetaUsuario };
      mockService.getByNumber.mockResolvedValue(expected);

      const result = await controller.findByNumber('1234567890123456');

      expect(result).toBe(expected);
      expect(mockService.getByNumber).toHaveBeenCalledWith('1234567890123456');
    });
  });

  
  describe('create', () => {
    it('should create a tarjeta without error', async () => {
      const tarjetaData: Partial<TarjetasUsuarios> = {
        usuario: 1,
        numero_tarjeta: '1234567890123456',
        cvc: '123',
        saldo: 100,
        caducidad: '2030-12-31',
      };
      const expected = { ...mockTarjetaUsuario };
      mockService.create.mockResolvedValue(expected);

      const result = await controller.create(tarjetaData);

      expect(result).toBe(expected);
      expect(mockService.create).toHaveBeenCalledWith(tarjetaData);
    });

    it('should throw error when create fails', async () => {
      const tarjetaData: Partial<TarjetasUsuarios> = {
        usuario: 1,
        numero_tarjeta: '1234567890123456',
        cvc: '123',
        saldo: 100,
        caducidad: '2030-12-31',
      };
      const error = new Error('Create failed');
      mockService.create.mockRejectedValue(error);

      await expect(controller.create(tarjetaData)).rejects.toThrow(error);
      expect(mockService.create).toHaveBeenCalledWith(tarjetaData);
    });
  });
});