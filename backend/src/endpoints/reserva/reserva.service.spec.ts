/// <reference types="jest" />
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReservaService } from './reserva.service';
import { Reserva } from './reserva.entity';

describe('ReservaService', () => {
  let service: ReservaService;
  let reservaRepository: jest.Mocked<Repository<Reserva>>;

  const mockReservaRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservaService,
        {
          provide: getRepositoryToken(Reserva),
          useValue: mockReservaRepository,
        },
      ],
    }).compile();

    service = module.get<ReservaService>(ReservaService);
    reservaRepository = module.get(getRepositoryToken(Reserva));
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it("debería llamar a reservaRepository.find con relaciones 'usuario' y 'espacio_publico' y retornar la lista de reservas", async () => {
      const resultado = [{ _id: 1 }, { _id: 2 }] as Reserva[];

      reservaRepository.find.mockResolvedValue(resultado);

      await expect(service.findAll()).resolves.toEqual(resultado);

      expect(reservaRepository.find).toHaveBeenCalledTimes(1);
      expect(reservaRepository.find).toHaveBeenCalledWith({
        relations: ['usuario', 'espacio_publico'],
      });
    });
  });

  describe('findOne', () => {
    it('debería llamar a reservaRepository.findOne con where: { _id: id } y retornar una reserva', async () => {
      const id = 1;
      const resultado = { _id: 1 } as Reserva;

      reservaRepository.findOne.mockResolvedValue(resultado);

      await expect(service.findOne(id)).resolves.toEqual(resultado);

      expect(reservaRepository.findOne).toHaveBeenCalledTimes(1);
      expect(reservaRepository.findOne).toHaveBeenCalledWith({
        where: { _id: id },
        relations: ['usuario', 'espacio_publico'],
      });
    });
  });

  describe('create', () => {
    it('debería llamar a reservaRepository.save con la reserva y retornar la reserva guardada', async () => {
      const reservaData: Partial<Reserva> = {
        hora_inicio: '08:00',
        hora_fin: '10:00',
      };

      const resultado = {
        _id: 1,
        ...reservaData,
      } as Reserva;

      reservaRepository.save.mockResolvedValue(resultado);

      await expect(service.create(reservaData)).resolves.toEqual(resultado);

      expect(reservaRepository.save).toHaveBeenCalledTimes(1);
      expect(reservaRepository.save).toHaveBeenCalledWith(reservaData);
    });
  });

  describe('update', () => {
    it('debería llamar a reservaRepository.update con id y reserva y ejecutar correctamente la actualización sin errores', async () => {
      const id = 1;
      const reservaData: Partial<Reserva> = {
        hora_inicio: '09:00',
        hora_fin: '11:00',
      };

      reservaRepository.update.mockResolvedValue({} as any);

      await expect(service.update(id, reservaData)).resolves.toBeUndefined();

      expect(reservaRepository.update).toHaveBeenCalledTimes(1);
      expect(reservaRepository.update).toHaveBeenCalledWith(id, reservaData);
    });
  });

  describe('delete', () => {
    it('debería llamar a reservaRepository.delete con id y ejecutar correctamente la eliminación sin errores', async () => {
      const id = 1;

      reservaRepository.delete.mockResolvedValue({} as any);

      await expect(service.delete(id)).resolves.toBeUndefined();

      expect(reservaRepository.delete).toHaveBeenCalledTimes(1);
      expect(reservaRepository.delete).toHaveBeenCalledWith(id);
    });
  });
});