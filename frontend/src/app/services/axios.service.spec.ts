/// <reference types="jest" />

import { Injector } from '@angular/core';
import axios from 'axios';
import { AxiosService } from './axios.service';
import { AuthService } from './auth.service';

jest.mock('axios');

describe('AxiosService', () => {
  let servicio: AxiosService;
  let mockInjector: { get: jest.Mock };
  let mockAuthService: { getToken: jest.Mock };
  let mockAxiosInstance: {
    interceptors: {
      request: {
        use: jest.Mock;
      };
    };
  };

  let requestSuccessHandler: any;
  let requestErrorHandler: any;

  beforeEach(() => {
    requestSuccessHandler = null;
    requestErrorHandler = null;

    mockAuthService = {
      getToken: jest.fn(),
    };

    mockInjector = {
      get: jest.fn().mockReturnValue(mockAuthService),
    };

    mockAxiosInstance = {
      interceptors: {
        request: {
          use: jest.fn((success, error) => {
            requestSuccessHandler = success;
            requestErrorHandler = error;
          }),
        },
      },
    };

    (axios.create as jest.Mock).mockReturnValue(mockAxiosInstance);

    servicio = new AxiosService(mockInjector as unknown as Injector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería crear correctamente el servicio', () => {
    expect(servicio).toBeTruthy();
  });

  it('debería llamar a axios.create() con la configuración correcta', () => {
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'http://localhost:3000',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
  });

  it('debería registrar el interceptor request correctamente', () => {
    expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalledTimes(1);
    expect(typeof requestSuccessHandler).toBe('function');
    expect(typeof requestErrorHandler).toBe('function');
  });

  it('debería agregar Authorization cuando existe token y skipAuth es false', () => {
    mockAuthService.getToken.mockReturnValue('mi-token');

    const config = {
      headers: {},
      skipAuth: false,
    };

    const resultado = requestSuccessHandler(config);

    expect(mockInjector.get).toHaveBeenCalledWith(AuthService);
    expect(mockAuthService.getToken).toHaveBeenCalledTimes(1);
    expect(resultado.headers.Authorization).toBe('Bearer mi-token');
  });

  it('debería no agregar Authorization cuando skipAuth es true', () => {
    mockAuthService.getToken.mockReturnValue('mi-token');

    const config = {
      headers: {},
      skipAuth: true,
    };

    const resultado = requestSuccessHandler(config);

    expect(mockInjector.get).toHaveBeenCalledWith(AuthService);
    expect(mockAuthService.getToken).not.toHaveBeenCalled();
    expect(resultado.headers.Authorization).toBeUndefined();
  });

  it('debería no agregar Authorization cuando no existe token', () => {
    mockAuthService.getToken.mockReturnValue(null);

    const config = {
      headers: {},
    };

    const resultado = requestSuccessHandler(config);

    expect(mockInjector.get).toHaveBeenCalledWith(AuthService);
    expect(mockAuthService.getToken).toHaveBeenCalledTimes(1);
    expect(resultado.headers.Authorization).toBeUndefined();
  });

  it('debería inicializar headers si no existen y hay token', () => {
    mockAuthService.getToken.mockReturnValue('mi-token');

    const config = {
      skipAuth: false,
    };

    const resultado = requestSuccessHandler(config);

    expect(resultado.headers).toBeDefined();
    expect(resultado.headers.Authorization).toBe('Bearer mi-token');
  });

  it('debería relanzar el error en el manejador de error del interceptor', async () => {
    const error = new Error('Request error');

    await expect(requestErrorHandler(error)).rejects.toThrow('Request error');
  });

  it('debería retornar la instancia configurada en getAxiosInstance()', () => {
    const resultado = servicio.getAxiosInstance();

    expect(resultado).toBe(mockAxiosInstance);
  });
});