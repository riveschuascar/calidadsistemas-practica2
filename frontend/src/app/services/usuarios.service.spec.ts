/// <reference types="jest" />

import { TestBed } from '@angular/core/testing';
import { UsuariosService } from './usuarios.service';
import { AxiosService } from './axios.service';

describe('UsuariosService', () => {
  let service: UsuariosService;

  let axiosServiceMock: {
    getAxiosInstance: jest.Mock;
  };

  let getMock: jest.Mock;
  let postMock: jest.Mock;
  let patchMock: jest.Mock;

  beforeEach(() => {
    getMock = jest.fn();
    postMock = jest.fn();
    patchMock = jest.fn();

    axiosServiceMock = {
      getAxiosInstance: jest.fn().mockReturnValue({
        get: getMock,
        post: postMock,
        patch: patchMock
      })
    };

    TestBed.configureTestingModule({
      providers: [
        UsuariosService,
        { provide: AxiosService, useValue: axiosServiceMock }
      ]
    });

    service = TestBed.inject(UsuariosService);

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('debería crear el servicio correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería llamar a GET /usuarios en getUsuarios()', async () => {
    getMock.mockResolvedValue({
      data: [{ ci: 1, email: 'usuario@test.com' }]
    });

    await service.getUsuarios();

    expect(getMock).toHaveBeenCalledWith('/usuarios');
  });

  it('debería retornar la data esperada en getUsuarios()', async () => {
    const usuarios = [{ ci: 1, email: 'usuario@test.com' }];
    getMock.mockResolvedValue({ data: usuarios });

    const result = await service.getUsuarios();

    expect(result).toEqual(usuarios);
  });

  it('debería relanzar el error cuando getUsuarios() falla con response.data', async () => {
    const error = {
      response: {
        data: 'Error al obtener usuarios'
      }
    };

    getMock.mockRejectedValue(error);

    await expect(service.getUsuarios()).rejects.toEqual(error);
    expect(console.error).toHaveBeenCalledWith(
      'Error al obtener usuarios:',
      'Error al obtener usuarios'
    );
  });

  it('debería relanzar el error cuando getUsuarios() falla con message', async () => {
    const error = new Error('Fallo de red');

    getMock.mockRejectedValue(error);

    await expect(service.getUsuarios()).rejects.toEqual(error);
    expect(console.error).toHaveBeenCalledWith(
      'Error al obtener usuarios:',
      'Fallo de red'
    );
  });

  it('debería llamar a POST /usuarios con el payload correcto en createUsuario()', async () => {
    const payload = {
      ci: 123456,
      email: 'nuevo@test.com',
      contrasena: '123456'
    };

    postMock.mockResolvedValue({
      data: payload
    });

    await service.createUsuario(payload);

    expect(postMock).toHaveBeenCalledWith('/usuarios', payload, {
      skipAuth: true
    });
  });

  it('debería retornar la data esperada en createUsuario()', async () => {
    const payload = {
      ci: 123456,
      email: 'nuevo@test.com',
      contrasena: '123456'
    };

    postMock.mockResolvedValue({
      data: payload
    });

    const result = await service.createUsuario(payload);

    expect(result).toEqual(payload);
  });

  it('debería relanzar el error cuando createUsuario() falla con response.data', async () => {
    const payload = {
      ci: 123456,
      email: 'nuevo@test.com',
      contrasena: '123456'
    };

    const error = {
      response: {
        data: 'Error al crear usuario'
      }
    };

    postMock.mockRejectedValue(error);

    await expect(service.createUsuario(payload)).rejects.toEqual(error);
    expect(console.error).toHaveBeenCalledWith(
      'Error al crear usuario:',
      'Error al crear usuario'
    );
  });

  it('debería relanzar el error cuando createUsuario() falla con message', async () => {
    const payload = {
      ci: 123456,
      email: 'nuevo@test.com',
      contrasena: '123456'
    };

    const error = new Error('Fallo al crear');

    postMock.mockRejectedValue(error);

    await expect(service.createUsuario(payload)).rejects.toEqual(error);
    expect(console.error).toHaveBeenCalledWith(
      'Error al crear usuario:',
      'Fallo al crear'
    );
  });

  it('debería llamar a PATCH /usuarios/{ci} con los datos correctos en updateUsuarioDatos()', async () => {
    const ci = 123456;
    const payload = {
      nombre: 'Juan',
      ap_paterno: 'Perez',
      telefono: '77777777'
    };

    patchMock.mockResolvedValue({
      data: payload
    });

    await service.updateUsuarioDatos(ci, payload);

    expect(patchMock).toHaveBeenCalledWith('/usuarios/123456', payload);
  });

  it('debería retornar la data esperada en updateUsuarioDatos()', async () => {
    const ci = 123456;
    const payload = {
      nombre: 'Juan',
      ap_paterno: 'Perez',
      telefono: '77777777'
    };

    patchMock.mockResolvedValue({
      data: payload
    });

    const result = await service.updateUsuarioDatos(ci, payload);

    expect(result).toEqual(payload);
  });

  it('debería relanzar el error cuando updateUsuarioDatos() falla con response.data', async () => {
    const ci = 123456;
    const payload = {
      nombre: 'Juan',
      ap_paterno: 'Perez'
    };

    const error = {
      response: {
        data: 'Error al actualizar usuario'
      }
    };

    patchMock.mockRejectedValue(error);

    await expect(service.updateUsuarioDatos(ci, payload)).rejects.toEqual(error);
    expect(console.error).toHaveBeenCalledWith(
      'Error al actualizar datos del usuario:',
      'Error al actualizar usuario'
    );
  });

  it('debería relanzar el error cuando updateUsuarioDatos() falla con message', async () => {
    const ci = 123456;
    const payload = {
      nombre: 'Juan',
      ap_paterno: 'Perez'
    };

    const error = new Error('Fallo al actualizar');

    patchMock.mockRejectedValue(error);

    await expect(service.updateUsuarioDatos(ci, payload)).rejects.toEqual(error);
    expect(console.error).toHaveBeenCalledWith(
      'Error al actualizar datos del usuario:',
      'Fallo al actualizar'
    );
  });
});