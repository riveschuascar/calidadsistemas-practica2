import { TestBed } from '@angular/core/testing';
import { EspacioPublicoService } from './espacios-publicos.service';
import { AxiosService } from './axios.service';

describe('EspacioPublicoService', () => {
  let servicio: EspacioPublicoService;
  let mockAxiosService: { getAxiosInstance: jest.Mock };
  let mockInstanciaAxios: { get: jest.Mock };

  beforeEach(() => {
    mockInstanciaAxios = {
      get: jest.fn(),
    };

    mockAxiosService = {
      getAxiosInstance: jest.fn().mockReturnValue(mockInstanciaAxios),
    };

    TestBed.configureTestingModule({
      providers: [
        EspacioPublicoService,
        { provide: AxiosService, useValue: mockAxiosService },
      ],
    });

    servicio = TestBed.inject(EspacioPublicoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería crear correctamente el servicio', () => {
    expect(servicio).toBeTruthy();
  });

  it('debería retornar los espacios desde caché cuando ya existan datos', async () => {
    const espaciosCacheados = [
      { id: 1, nombre: 'Cancha A', tipo: 'deportivo' },
      { id: 2, nombre: 'Plaza B', tipo: 'recreativo' },
    ];

    (servicio as any).espacios = espaciosCacheados;

    const resultado = await servicio.getAll();

    expect(resultado).toEqual(espaciosCacheados);
    expect(mockAxiosService.getAxiosInstance).not.toHaveBeenCalled();
    expect(mockInstanciaAxios.get).not.toHaveBeenCalled();
  });

  it('debería llamar a GET /espacios-publicos cuando la caché esté vacía', async () => {
    const espaciosApi = [
      { id: 1, nombre: 'Cancha A', tipo: 'deportivo' },
      { id: 2, nombre: 'Plaza B', tipo: 'recreativo' },
    ];

    mockInstanciaAxios.get.mockResolvedValue({ data: espaciosApi });

    const resultado = await servicio.getAll();

    expect(mockAxiosService.getAxiosInstance).toHaveBeenCalledTimes(1);
    expect(mockInstanciaAxios.get).toHaveBeenCalledWith('/espacios-publicos');
    expect(resultado).toEqual(espaciosApi);
  });

  it('debería almacenar la data obtenida desde la API', async () => {
    const espaciosApi = [
      { id: 1, nombre: 'Cancha A', tipo: 'deportivo' },
      { id: 2, nombre: 'Plaza B', tipo: 'recreativo' },
    ];

    mockInstanciaAxios.get.mockResolvedValue({ data: espaciosApi });

    await servicio.getAll();

    expect((servicio as any).espacios).toEqual(espaciosApi);
  });

  it('debería retornar la data esperada en getAll()', async () => {
    const espaciosApi = [
      { id: 1, nombre: 'Cancha A', tipo: 'deportivo' },
      { id: 2, nombre: 'Plaza B', tipo: 'recreativo' },
    ];

    mockInstanciaAxios.get.mockResolvedValue({ data: espaciosApi });

    const resultado = await servicio.getAll();

    expect(resultado).toEqual(espaciosApi);
  });

  it('debería filtrar correctamente los espacios por tipo en getByType()', async () => {
    const espacios = [
      { id: 1, nombre: 'Cancha A', tipo: 'deportivo' },
      { id: 2, nombre: 'Plaza B', tipo: 'recreativo' },
      { id: 3, nombre: 'Cancha B', tipo: 'deportivo' },
    ];

    jest.spyOn(servicio, 'getAll').mockResolvedValue(espacios);

    const resultado = await servicio.getByType('deportivo');

    expect(servicio.getAll).toHaveBeenCalledTimes(1);
    expect(resultado).toEqual([
      { id: 1, nombre: 'Cancha A', tipo: 'deportivo' },
      { id: 3, nombre: 'Cancha B', tipo: 'deportivo' },
    ]);
  });

  it('debería almacenar correctamente el espacio seleccionado con setEspacioSeleccionado()', () => {
    const espacio = { id: 10, nombre: 'Parque Central', tipo: 'recreativo' };

    servicio.setEspacioSeleccionado(espacio);

    expect((servicio as any).espacioSeleccionado).toEqual(espacio);
  });

  it('debería retornar el espacio seleccionado almacenado con getEspacioSeleccionado()', () => {
    const espacio = { id: 10, nombre: 'Parque Central', tipo: 'recreativo' };
    (servicio as any).espacioSeleccionado = espacio;

    const resultado = servicio.getEspacioSeleccionado();

    expect(resultado).toEqual(espacio);
  });

  it('debería relanzar el error cuando la petición falla en getAll()', async () => {
    const error = new Error('Network error');
    const spyConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    mockInstanciaAxios.get.mockRejectedValue(error);

    await expect(servicio.getAll()).rejects.toThrow('Network error');

    expect(spyConsoleError).toHaveBeenCalledWith(
      'Error al obtener los espacios públicos:',
      'Network error'
    );

    spyConsoleError.mockRestore();
  });
});