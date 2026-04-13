import { Test, TestingModule } from '@nestjs/testing';
import { EventoService } from './evento.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Evento } from './evento.entity';
import { Reserva } from '../reserva/reserva.entity';
import { TipoEvento } from '../tipo-evento/tipo-evento.entity';

describe('EventoService', () => {
  let service: EventoService;

  const mockEventoRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockReservaRepository = {
    findOne: jest.fn(),
  };

  const mockTipoEventoRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventoService,
        {
          provide: getRepositoryToken(Evento),
          useValue: mockEventoRepository,
        },
        {
          provide: getRepositoryToken(Reserva),
          useValue: mockReservaRepository,
        },
        {
          provide: getRepositoryToken(TipoEvento),
          useValue: mockTipoEventoRepository,
        },
      ],
    }).compile();

    service = module.get<EventoService>(EventoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // 🔹 TEST 1
  it('debería retornar todos los eventos', async () => {
    const resultado = [{ id: 1 }];
    mockEventoRepository.find.mockResolvedValue(resultado);

    const res = await service.findAll();

    expect(res).toEqual(resultado);
    expect(mockEventoRepository.find).toHaveBeenCalledWith({
      relations: ['id_reserva', 'id_tipo_evento'],
    });
  });

  // 🔹 TEST 2
  it('debería retornar un evento por id', async () => {
    const evento = { id: 1 };
    mockEventoRepository.findOne.mockResolvedValue(evento);

    const res = await service.findOne(1);

    expect(res).toEqual(evento);
    expect(mockEventoRepository.findOne).toHaveBeenCalledWith({
      where: { _id: 1 },
      relations: ['id_reserva', 'id_tipo_evento'],
    });
  });

  // 🔹 TEST 3 (create OK)
  it('debería crear un evento correctamente', async () => {
    const data = {
      id_reserva: 1,
      id_tipo_evento: 2,
      nombre: 'Evento',
      descripcion: 'Desc',
      fecha_evento: new Date(),
    };

    const reserva = { _id: 1 };
    const tipoEvento = { _id: 2 };

    const eventoCreado = {
      reserva,
      tipo_evento: tipoEvento,
      nombre: data.nombre,
      descripcion: data.descripcion,
      fecha_evento: data.fecha_evento,
    };

    const eventoGuardado = { id: 1, ...eventoCreado };

    mockReservaRepository.findOne.mockResolvedValue(reserva);
    mockTipoEventoRepository.findOne.mockResolvedValue(tipoEvento);
    mockEventoRepository.create.mockReturnValue(eventoCreado);
    mockEventoRepository.save.mockResolvedValue(eventoGuardado);

    const res = await service.create(data);

    expect(res).toEqual(eventoGuardado);

    expect(mockReservaRepository.findOne).toHaveBeenCalledWith({
      where: { _id: 1 },
    });

    expect(mockTipoEventoRepository.findOne).toHaveBeenCalledWith({
      where: { _id: 2 },
    });

    expect(mockEventoRepository.create).toHaveBeenCalledWith({
      reserva: reserva,
      tipo_evento: tipoEvento,
      nombre: data.nombre,
      descripcion: data.descripcion,
      fecha_evento: data.fecha_evento,
    });

    expect(mockEventoRepository.save).toHaveBeenCalledWith(eventoCreado);
  });

  // 🔹 TEST 4 (error reserva)
  it('debería lanzar error si reserva no existe', async () => {
    const data = {
      id_reserva: 1,
      id_tipo_evento: 2,
      nombre: 'Evento',
      descripcion: 'Desc',
      fecha_evento: new Date(),
    };

    mockReservaRepository.findOne.mockResolvedValue(null);

    await expect(service.create(data)).rejects.toThrow(
      'Reserva no encontrada',
    );
  });

  // 🔹 TEST 5 (error tipo evento)
  it('debería lanzar error si tipo evento no existe', async () => {
    const data = {
      id_reserva: 1,
      id_tipo_evento: 2,
      nombre: 'Evento',
      descripcion: 'Desc',
      fecha_evento: new Date(),
    };

    mockReservaRepository.findOne.mockResolvedValue({ _id: 1 });
    mockTipoEventoRepository.findOne.mockResolvedValue(null);

    await expect(service.create(data)).rejects.toThrow(
      'Tipo de evento no encontrado',
    );
  });

  // 🔹 TEST 6
  it('debería eliminar un evento', async () => {
    mockEventoRepository.delete.mockResolvedValue(undefined);

    await service.delete(1);

    expect(mockEventoRepository.delete).toHaveBeenCalledWith(1);
  });
});