/// <reference types="jest" />

import { TestBed } from '@angular/core/testing';
import { ReservaService } from './reserva.service';
import { AxiosService } from './axios.service';

describe('ReservaService', () => {
  let servicio: ReservaService;
  let mockAxiosService: { getAxiosInstance: jest.Mock };
  let mockInstanciaAxios: { post: jest.Mock };

  beforeEach(() => {
    mockInstanciaAxios = {
      post: jest.fn(),
    };

    mockAxiosService = {
      getAxiosInstance: jest.fn().mockReturnValue(mockInstanciaAxios),
    };

    TestBed.configureTestingModule({
      providers: [
        ReservaService,
        { provide: AxiosService, useValue: mockAxiosService },
      ],
    });

    servicio = TestBed.inject(ReservaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería crear correctamente el servicio', () => {
    expect(servicio).toBeTruthy();
  });

  it('debería llamar a POST /reservas con el body correcto', async () => {
    const body = {
      usuario: 1,
      espacio_publico: 2,
      fecha: '2026-04-18',
      hora_inicio: '08:00',
      hora_fin: '09:00',
    };

    const respuesta = {
      id: 10,
      ...body,
    };

    mockInstanciaAxios.post.mockResolvedValue({ data: respuesta });

    await servicio.postReserva(body);

    expect(mockAxiosService.getAxiosInstance).toHaveBeenCalledTimes(1);
    expect(mockInstanciaAxios.post).toHaveBeenCalledWith('/reservas', body);
  });

  it('debería retornar la data esperada', async () => {
    const body = {
      usuario: 1,
      espacio_publico: 2,
      fecha: '2026-04-18',
      hora_inicio: '08:00',
      hora_fin: '09:00',
    };

    const respuesta = {
      id: 10,
      ...body,
    };

    mockInstanciaAxios.post.mockResolvedValue({ data: respuesta });

    const resultado = await servicio.postReserva(body);

    expect(resultado).toEqual(respuesta);
  });

  it('debería relanzar el error cuando la petición falla', async () => {
    const body = {
      usuario: 1,
      espacio_publico: 2,
      fecha: '2026-04-18',
      hora_inicio: '08:00',
      hora_fin: '09:00',
    };

    const error = new Error('Network error');
    const spyConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

    mockInstanciaAxios.post.mockRejectedValue(error);

    await expect(servicio.postReserva(body)).rejects.toThrow('Network error');

    expect(spyConsoleLog).toHaveBeenCalledWith(
      'Error al guardar informacion de la reserva'
    );

    spyConsoleLog.mockRestore();
  });
});