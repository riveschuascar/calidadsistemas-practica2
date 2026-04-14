/// <reference types="jest" />
import { Test, TestingModule } from '@nestjs/testing';
import { ReservaController } from './reserva.controller';
import { ReservaService } from './reserva.service';
import { Reserva } from './reserva.entity';

describe('ReservaController', () => {
  let controller: ReservaController;
  let service: jest.Mocked<ReservaService>;

  const mockReservaService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservaController],
      providers: [
        {
          provide: ReservaService,
          useValue: mockReservaService,
        },
      ],
    }).compile();

    controller = module.get<ReservaController>(ReservaController);
    service = module.get(ReservaService);
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('debería llamar a reservaService.findAll y retornar la lista de reservas', async () => {
      const resultado = [
        { _id: 1 },
        { _id: 2 },
      ] as Reserva[];

      service.findAll.mockResolvedValue(resultado);

      await expect(controller.findAll()).resolves.toEqual(resultado);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('debería llamar a reservaService.findOne con el id y retornar una reserva', async () => {
      const id = 1;
      const resultado = { _id: 1 } as Reserva;

      service.findOne.mockResolvedValue(resultado);

      await expect(controller.findOne(id)).resolves.toEqual(resultado);
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('create', () => {
    it('debería llamar a reservaService.create con reservaData y retornar la reserva creada', async () => {
      const reservaData: Partial<Reserva> = {
        hora_inicio: '08:00',
        hora_fin: '10:00',
      };

      const resultado = {
        _id: 1,
        ...reservaData,
      } as Reserva;

      service.create.mockResolvedValue(resultado);

      await expect(controller.create(reservaData)).resolves.toEqual(resultado);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(reservaData);
    });
  });

  describe('update', () => {
    it('debería llamar a reservaService.update con id y reservaData y ejecutar la actualización sin errores', async () => {
      const id = 1;
      const reservaData: Partial<Reserva> = {
        hora_inicio: '09:00',
        hora_fin: '11:00',
      };

      service.update.mockResolvedValue(undefined);

      await expect(controller.update(id, reservaData)).resolves.toBeUndefined();
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(id, reservaData);
    });
  });

  describe('delete', () => {
    it('debería llamar a reservaService.delete con id y ejecutar la eliminación sin errores', async () => {
      const id = 1;

      service.delete.mockResolvedValue(undefined);

      await expect(controller.delete(id)).resolves.toBeUndefined();
      expect(service.delete).toHaveBeenCalledTimes(1);
      expect(service.delete).toHaveBeenCalledWith(id);
    });
  });
});