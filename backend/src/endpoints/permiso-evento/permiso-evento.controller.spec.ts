/// <reference types="jest" />
import { Test, TestingModule } from '@nestjs/testing';
import { PermisoEventoController } from './permiso-evento.controller';
import { PermisoEventoService } from './permiso-evento.service';

describe('PermisoEventoController', () => {
  let controller: PermisoEventoController;
  let service: jest.Mocked<PermisoEventoService>;

  const mockPermisoEventoService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermisoEventoController],
      providers: [
        {
          provide: PermisoEventoService,
          useValue: mockPermisoEventoService,
        },
      ],
    }).compile();

    controller = module.get<PermisoEventoController>(PermisoEventoController);
    service = module.get(PermisoEventoService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call service.findAll and return the result', async () => {
      const result = [
        { evento: 1, permiso: 2 },
        { evento: 2, permiso: 3 },
      ] as any;

      service.findAll.mockResolvedValue(result);

      await expect(controller.findAll()).resolves.toEqual(result);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with the correct params and return the result', async () => {
      const result = { evento: 1, permiso: 2 } as any;
      const evento = 1;
      const permiso = 2;

      service.findOne.mockResolvedValue(result);

      await expect(controller.findOne(evento, permiso)).resolves.toEqual(result);
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledWith(evento, permiso);
    });
  });

  describe('create', () => {
    it('should call service.create with the payload and return the created record', async () => {
      const data = { evento: 1, permiso: 2 } as any;
      const result = { evento: 1, permiso: 2 } as any;

      service.create.mockResolvedValue(result);

      await expect(controller.create(data)).resolves.toEqual(result);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(data);
    });
  });

  describe('update', () => {
    it('should call service.update with the correct params', async () => {
      const evento = 1;
      const permiso = 2;
      const data = { estado: true } as any;

      service.update.mockResolvedValue(undefined);

      await expect(controller.update(evento, permiso, data)).resolves.toBeUndefined();
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(evento, permiso, data);
    });
  });

  describe('delete', () => {
    it('should call service.delete with the correct params', async () => {
      const evento = 1;
      const permiso = 2;

      service.delete.mockResolvedValue(undefined);

      await expect(controller.delete(evento, permiso)).resolves.toBeUndefined();
      expect(service.delete).toHaveBeenCalledTimes(1);
      expect(service.delete).toHaveBeenCalledWith(evento, permiso);
    });
  });
});