/// <reference types="jest" />
import { Test, TestingModule } from '@nestjs/testing';
import { PresidenteOtbController } from './presidente_otb.controller';
import { PresidenteOtbService } from './presidente_otb.service';

describe('PresidenteOtbController', () => {
  let controller: PresidenteOtbController;
  let service: jest.Mocked<PresidenteOtbService>;

  const mockPresidenteOtbService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findUsuarioByCi: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresidenteOtbController],
      providers: [
        {
          provide: PresidenteOtbService,
          useValue: mockPresidenteOtbService,
        },
      ],
    }).compile();

    controller = module.get<PresidenteOtbController>(PresidenteOtbController);
    service = module.get(PresidenteOtbService);
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('debería llamar a presidenteOtbService.findAll y retornar la lista de presidentes-otb', async () => {
      const resultado = [
        { _id: 1, otb: 'OTB Central' },
        { _id: 2, otb: 'OTB Norte' },
      ] as any;

      service.findAll.mockResolvedValue(resultado);

      await expect(controller.findAll()).resolves.toEqual(resultado);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('debería llamar a presidenteOtbService.findOne con el id y retornar un presidente-otb', async () => {
      const id = 1;
      const resultado = { _id: 1, otb: 'OTB Central' } as any;

      service.findOne.mockResolvedValue(resultado);

      await expect(controller.findOne(id)).resolves.toEqual(resultado);
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('create', () => {
    it('debería llamar a presidenteOtbService.findUsuarioByCi con ci_usuario', async () => {
      const body = {
        ci_usuario: 123456,
        otb: 'OTB Central',
        documento: Buffer.from('archivo'),
      };

      const usuario = { ci: 123456, nombre: 'Juan' } as any;
      const creado = {
        usuario,
        otb: body.otb,
        documento: body.documento,
      } as any;

      service.findUsuarioByCi.mockResolvedValue(usuario);
      service.create.mockResolvedValue(creado);

      await expect(controller.create(body)).resolves.toEqual(creado);

      expect(service.findUsuarioByCi).toHaveBeenCalledTimes(1);
      expect(service.findUsuarioByCi).toHaveBeenCalledWith(body.ci_usuario);
    });

    it('debería retornar error si el usuario no existe', async () => {
      const body = {
        ci_usuario: 999999,
        otb: 'OTB Central',
        documento: Buffer.from('archivo'),
      };

      service.findUsuarioByCi.mockResolvedValue(null);

      await expect(controller.create(body)).rejects.toThrow('Usuario no encontrado');
      expect(service.findUsuarioByCi).toHaveBeenCalledTimes(1);
      expect(service.findUsuarioByCi).toHaveBeenCalledWith(body.ci_usuario);
      expect(service.create).not.toHaveBeenCalled();
    });

    it('debería llamar a presidenteOtbService.create y retornar el presidente-otb creado', async () => {
      const body = {
        ci_usuario: 123456,
        otb: 'OTB Central',
        documento: Buffer.from('archivo'),
      };

      const usuario = { ci: 123456, nombre: 'Juan' } as any;
      const creado = {
        _id: 1,
        usuario,
        otb: body.otb,
        documento: body.documento,
      } as any;

      service.findUsuarioByCi.mockResolvedValue(usuario);
      service.create.mockResolvedValue(creado);

      await expect(controller.create(body)).resolves.toEqual(creado);

      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith({
        usuario,
        otb: body.otb,
        documento: body.documento,
      });
    });
  });
});