import { Test, TestingModule } from '@nestjs/testing';
import { EventoController } from './evento.controller';
import { EventoService } from './evento.service';

describe('EventoController', () => {
  let controller: EventoController;

  const mockEventoService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventoController],
      providers: [
        {
          provide: EventoService,
          useValue: mockEventoService,
        },
      ],
    }).compile();

    controller = module.get<EventoController>(EventoController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // 🔹 TEST 1
  it('debería retornar todos los eventos', async () => {
    const resultado = [{ id: 1 }];
    mockEventoService.findAll.mockResolvedValue(resultado);

    const res = await controller.findAll();

    expect(res).toEqual(resultado);
    expect(mockEventoService.findAll).toHaveBeenCalled();
  });

  // 🔹 TEST 2
  it('debería retornar un evento por id', async () => {
    const evento = { id: 1 };
    mockEventoService.findOne.mockResolvedValue(evento);

    const res = await controller.findOne(1);

    expect(res).toEqual(evento);
    expect(mockEventoService.findOne).toHaveBeenCalledWith(1);
  });

  // 🔹 TEST 3
  it('debería crear un evento correctamente', async () => {
    const data = {
      id_reserva: 1,
      id_tipo_evento: 2,
      nombre: 'Evento',
      descripcion: 'Desc',
      fecha_evento: new Date(),
    };

    const eventoCreado = { id: 1, ...data };

    mockEventoService.create.mockResolvedValue(eventoCreado);

    const res = await controller.create(data);

    expect(res).toEqual(eventoCreado);
    expect(mockEventoService.create).toHaveBeenCalledWith(data);
  });

  // 🔹 TEST 4
  it('debería eliminar un evento', async () => {
    mockEventoService.delete.mockResolvedValue(undefined);

    await controller.delete(1);

    expect(mockEventoService.delete).toHaveBeenCalledWith(1);
  });
});