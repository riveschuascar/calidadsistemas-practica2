/// <reference types="jest" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroDatosComponent } from './registro-datos.component';
import { UsuariosService } from '../services/usuarios.service';
import { Router } from '@angular/router';

describe('RegistroDatosComponent', () => {
  let component: RegistroDatosComponent;
  let fixture: ComponentFixture<RegistroDatosComponent>;
  let compiled: HTMLElement;

  let usuariosServiceMock: {
    updateUsuarioDatos: jest.Mock;
  };

  let routerMock: {
    navigate: jest.Mock;
  };

  beforeEach(async () => {
    usuariosServiceMock = {
      updateUsuarioDatos: jest.fn()
    };

    routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [RegistroDatosComponent],
      providers: [
        { provide: UsuariosService, useValue: usuariosServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroDatosComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;

    jest.spyOn(Storage.prototype, 'getItem');
    jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('debería crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar registroDatosData con los valores esperados', () => {
    expect(component.registroDatosData).toEqual({
      nombre: '',
      ap_paterno: '',
      ap_materno: '',
      direccion: '',
      telefono: ''
    });
  });

  it('debería inicializar errorMessage vacío', () => {
    expect(component.errorMessage).toBe('');
  });

  it('debería renderizar el título "Completar Registro"', () => {
    const titulo = compiled.querySelector('h2');

    expect(titulo).toBeTruthy();
    expect(titulo?.textContent?.trim()).toBe('Completar Registro');
  });

  it('debería renderizar el formulario', () => {
    expect(compiled.querySelector('form')).toBeTruthy();
  });

  it('debería renderizar los inputs principales del formulario', () => {
    expect(compiled.querySelector('#nombre')).toBeTruthy();
    expect(compiled.querySelector('#ap_paterno')).toBeTruthy();
    expect(compiled.querySelector('#ap_materno')).toBeTruthy();
    expect(compiled.querySelector('#direccion')).toBeTruthy();
    expect(compiled.querySelector('#telefono')).toBeTruthy();
  });

  it('debería renderizar el botón "Guardar" de tipo submit', () => {
    const boton = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;

    expect(boton).toBeTruthy();
    expect(boton.textContent?.trim()).toBe('Guardar');
    expect(boton.type).toBe('submit');
  });

  it('debería manejar errores del servicio cuando el error no tiene propiedad message', async () => {
  jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('123456');
  usuariosServiceMock.updateUsuarioDatos.mockRejectedValue('Error simple');

  component.registroDatosData = {
    nombre: 'Juan',
    ap_paterno: 'Perez',
    ap_materno: 'Gomez',
    direccion: 'Av. Siempre Viva',
    telefono: '77777777'
  };

  await expect(component.onRegistroDatosSubmit()).resolves.toBeUndefined();

  expect(component.errorMessage).toBe(
    'Ocurrió un error al actualizar los datos del usuario.'
  );
  expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('debería asignar error si no existe ci_usuario en localStorage', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

    await component.onRegistroDatosSubmit();

    expect(component.errorMessage).toBe(
      'No se encontró el CI del usuario. Por favor, regístrese de nuevo.'
    );
    expect(usuariosServiceMock.updateUsuarioDatos).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('debería llamar a updateUsuarioDatos con el CI parseado y los datos correctos', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('123456');
    usuariosServiceMock.updateUsuarioDatos.mockResolvedValue({ ok: true });

    component.registroDatosData = {
      nombre: 'Juan',
      ap_paterno: 'Perez',
      ap_materno: 'Gomez',
      direccion: 'Av. Siempre Viva',
      telefono: '77777777'
    };

    await component.onRegistroDatosSubmit();

    expect(usuariosServiceMock.updateUsuarioDatos).toHaveBeenCalledWith(123456, {
      nombre: 'Juan',
      ap_paterno: 'Perez',
      ap_materno: 'Gomez',
      direccion: 'Av. Siempre Viva',
      telefono: '77777777'
    });
  });

  it('debería eliminar ci_usuario de localStorage después de una actualización exitosa', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('123456');
    usuariosServiceMock.updateUsuarioDatos.mockResolvedValue({ ok: true });

    component.registroDatosData = {
      nombre: 'Juan',
      ap_paterno: 'Perez',
      ap_materno: 'Gomez',
      direccion: 'Av. Siempre Viva',
      telefono: '77777777'
    };

    await component.onRegistroDatosSubmit();

    expect(localStorage.removeItem).toHaveBeenCalledWith('ci_usuario');
  });

  it('debería navegar a /home después de una actualización exitosa', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('123456');
    usuariosServiceMock.updateUsuarioDatos.mockResolvedValue({ ok: true });

    component.registroDatosData = {
      nombre: 'Juan',
      ap_paterno: 'Perez',
      ap_materno: 'Gomez',
      direccion: 'Av. Siempre Viva',
      telefono: '77777777'
    };

    await component.onRegistroDatosSubmit();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('debería manejar errores del servicio asignando errorMessage', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('123456');
    usuariosServiceMock.updateUsuarioDatos.mockRejectedValue(new Error('Error de servicio'));

    component.registroDatosData = {
      nombre: 'Juan',
      ap_paterno: 'Perez',
      ap_materno: 'Gomez',
      direccion: 'Av. Siempre Viva',
      telefono: '77777777'
    };

    await expect(component.onRegistroDatosSubmit()).resolves.toBeUndefined();

    expect(component.errorMessage).toBe(
      'Ocurrió un error al actualizar los datos del usuario.'
    );
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('debería marcar los campos del formulario como requeridos en el template', () => {
    const nombre = compiled.querySelector('#nombre') as HTMLInputElement;
    const apPaterno = compiled.querySelector('#ap_paterno') as HTMLInputElement;
    const apMaterno = compiled.querySelector('#ap_materno') as HTMLInputElement;
    const direccion = compiled.querySelector('#direccion') as HTMLInputElement;
    const telefono = compiled.querySelector('#telefono') as HTMLInputElement;

    expect(nombre.required).toBe(true);
    expect(apPaterno.required).toBe(true);
    expect(apMaterno.required).toBe(true);
    expect(direccion.required).toBe(true);
    expect(telefono.required).toBe(true);
  });
});