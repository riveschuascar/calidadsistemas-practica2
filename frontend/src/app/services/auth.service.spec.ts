/// <reference types="jest" />

import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { AxiosService } from './axios.service';
import { AuthStateService } from './auth-state.service';

describe('AuthService', () => {
  let service: AuthService;

  let axiosServiceMock: {
    getAxiosInstance: jest.Mock;
  };

  let authStateServiceMock: {
    setAuthStatus: jest.Mock;
  };

  let postMock: jest.Mock;

  beforeEach(() => {
    postMock = jest.fn();

    axiosServiceMock = {
      getAxiosInstance: jest.fn().mockReturnValue({
        post: postMock
      })
    };

    authStateServiceMock = {
      setAuthStatus: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: AxiosService, useValue: axiosServiceMock },
        { provide: AuthStateService, useValue: authStateServiceMock }
      ]
    });

    service = TestBed.inject(AuthService);

    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => null);
    jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('debería crear el servicio correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería llamar al endpoint de login con el payload correcto', async () => {
    postMock.mockResolvedValue({
      data: {
        access_token: 'token-123'
      }
    });

    await service.login('usuario@test.com', '123456');

    expect(postMock).toHaveBeenCalledWith('/auth/login', {
      email: 'usuario@test.com',
      contrasena: '123456'
    });
  });

  it('debería guardar el token en localStorage al iniciar sesión', async () => {
    const saveTokenSpy = jest.spyOn(service, 'saveToken');
    postMock.mockResolvedValue({
      data: {
        access_token: 'token-123'
      }
    });

    await service.login('usuario@test.com', '123456');

    expect(saveTokenSpy).toHaveBeenCalledWith('token-123');
    expect(localStorage.setItem).toHaveBeenCalledWith('access_token', 'token-123');
  });

  it('debería actualizar el estado de autenticación a true al iniciar sesión', async () => {
    postMock.mockResolvedValue({
      data: {
        access_token: 'token-123'
      }
    });

    await service.login('usuario@test.com', '123456');

    expect(authStateServiceMock.setAuthStatus).toHaveBeenCalledWith(true);
  });

  it('debería retornar la respuesta esperada al iniciar sesión', async () => {
    const responseData = {
      access_token: 'token-123'
    };

    postMock.mockResolvedValue({
      data: responseData
    });

    const result = await service.login('usuario@test.com', '123456');

    expect(result).toEqual(responseData);
  });

  it('debería relanzar el error cuando login falla', async () => {
    const error = {
      response: {
        data: 'Credenciales inválidas'
      }
    };

    postMock.mockRejectedValue(error);

    await expect(service.login('usuario@test.com', 'mala-clave')).rejects.toEqual(error);
    expect(console.error).toHaveBeenCalled();
  });

  it('debería guardar el token con saveToken()', () => {
    service.saveToken('mi-token');

    expect(localStorage.setItem).toHaveBeenCalledWith('access_token', 'mi-token');
  });

  it('debería recuperar el token con getToken()', () => {
    (localStorage.getItem as jest.Mock).mockReturnValue('mi-token');

    const result = service.getToken();

    expect(localStorage.getItem).toHaveBeenCalledWith('access_token');
    expect(result).toBe('mi-token');
  });

  it('debería eliminar el token y actualizar el estado a false al hacer logout', () => {
    service.logout();

    expect(localStorage.removeItem).toHaveBeenCalledWith('access_token');
    expect(authStateServiceMock.setAuthStatus).toHaveBeenCalledWith(false);
  });

  it('debería retornar true en isAuthenticated() cuando existe token', () => {
    jest.spyOn(service, 'getToken').mockReturnValue('token-123');

    const result = service.isAuthenticated();

    expect(result).toBe(true);
  });

  it('debería retornar false en isAuthenticated() cuando no existe token', () => {
    jest.spyOn(service, 'getToken').mockReturnValue(null);

    const result = service.isAuthenticated();

    expect(result).toBe(false);
  });
});