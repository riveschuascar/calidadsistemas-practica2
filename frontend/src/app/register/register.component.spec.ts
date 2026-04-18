/// <reference types="jest" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { UsuariosService } from '../services/usuarios.service';
import { Router } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let compiled: HTMLElement;

  let usuariosServiceMock: {
    createUsuario: jest.Mock;
  };

  let routerMock: {
    navigate: jest.Mock;
  };

  beforeEach(async () => {
    usuariosServiceMock = {
      createUsuario: jest.fn()
    };

    routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        { provide: UsuariosService, useValue: usuariosServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;

    Storage.prototype.setItem = jest.fn();

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

  it('debería inicializar registerData con los valores esperados', () => {
    expect(component.registerData).toEqual({
      ci: null,
      email: '',
      password: '',
      confirmPassword: ''
    });
  });

  it('debería inicializar los mensajes de error vacíos', () => {
    expect(component.passwordError).toBe('');
    expect(component.emailError).toBe('');
    expect(component.ciUsuarioError).toBe('');
  });

  it('debería renderizar el título "Crear Cuenta"', () => {
    const titulo = compiled.querySelector('h2');

    expect(titulo).toBeTruthy();
    expect(titulo?.textContent?.trim()).toBe('Crear Cuenta');
  });

  it('debería renderizar el formulario de registro', () => {
    expect(compiled.querySelector('form')).toBeTruthy();
  });

  it('debería renderizar los inputs principales del formulario', () => {
    expect(compiled.querySelector('#ciUsuario')).toBeTruthy();
    expect(compiled.querySelector('#email')).toBeTruthy();
    expect(compiled.querySelector('#password')).toBeTruthy();
    expect(compiled.querySelector('#confirmPassword')).toBeTruthy();
  });

  it('debería renderizar el botón "Crear cuenta" de tipo submit', () => {
    const boton = compiled.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;

    expect(boton).toBeTruthy();
    expect(boton.textContent?.trim()).toBe('Crear cuenta');
    expect(boton.type).toBe('submit');
  });

  it('debería asignar error si el CI es nulo', async () => {
    component.registerData = {
      ci: null,
      email: 'usuario@test.com',
      password: '123456',
      confirmPassword: '123456'
    };

    await component.onRegisterSubmit();

    expect(component.ciUsuarioError).toBe(
      'El CI de usuario es obligatorio y debe ser un número válido'
    );
    expect(usuariosServiceMock.createUsuario).not.toHaveBeenCalled();
  });

  it('debería asignar error si las contraseñas no coinciden', async () => {
    component.registerData = {
      ci: 123456,
      email: 'usuario@test.com',
      password: '123456',
      confirmPassword: '654321'
    };

    await component.onRegisterSubmit();

    expect(component.passwordError).toBe('Las contraseñas no coinciden');
    expect(usuariosServiceMock.createUsuario).not.toHaveBeenCalled();
  });

  it('debería asignar error si el formato del email es inválido', async () => {
    component.registerData = {
      ci: 123456,
      email: 'correo-invalido',
      password: '123456',
      confirmPassword: '123456'
    };

    await component.onRegisterSubmit();

    expect(component.emailError).toBe('El formato del email es inválido');
    expect(usuariosServiceMock.createUsuario).not.toHaveBeenCalled();
  });

  it('debería llamar a createUsuario con datos válidos', async () => {
    usuariosServiceMock.createUsuario.mockResolvedValue({ ci: 123456 });

    component.registerData = {
      ci: 123456,
      email: 'usuario@test.com',
      password: '123456',
      confirmPassword: '123456'
    };

    await component.onRegisterSubmit();

    expect(usuariosServiceMock.createUsuario).toHaveBeenCalledWith({
      ci: 123456,
      email: 'usuario@test.com',
      contrasena: '123456'
    });
  });

  it('debería guardar ci_usuario y navegar cuando el registro es exitoso', async () => {
    usuariosServiceMock.createUsuario.mockResolvedValue({ ci: 123456 });

    component.registerData = {
      ci: 123456,
      email: 'usuario@test.com',
      password: '123456',
      confirmPassword: '123456'
    };

    await component.onRegisterSubmit();

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'ci_usuario',
      '123456'
    );

    expect(routerMock.navigate).toHaveBeenCalledWith([
      '/registro-datos'
    ]);
  });

  it('no debería navegar si la respuesta no contiene ci', async () => {
    usuariosServiceMock.createUsuario.mockResolvedValue({
      mensaje: 'ok'
    });

    component.registerData = {
      ci: 123456,
      email: 'usuario@test.com',
      password: '123456',
      confirmPassword: '123456'
    };

    await component.onRegisterSubmit();

    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('debería manejar errores del servicio sin romper ejecución', async () => {
    usuariosServiceMock.createUsuario.mockRejectedValue(
      new Error('Error de servicio')
    );

    component.registerData = {
      ci: 123456,
      email: 'usuario@test.com',
      password: '123456',
      confirmPassword: '123456'
    };

    await expect(
      component.onRegisterSubmit()
    ).resolves.toBeUndefined();
  });

  it('debería mostrar error de CI en pantalla', () => {
    component.ciUsuarioError = 'Error de CI';
    fixture.detectChanges();

    expect(compiled.textContent).toContain('Error de CI');
  });

  it('debería mostrar error de email en pantalla', () => {
    component.emailError = 'Error de email';
    fixture.detectChanges();

    expect(compiled.textContent).toContain('Error de email');
  });

  it('debería mostrar error de contraseña en pantalla', () => {
    component.passwordError = 'Error de contraseña';
    fixture.detectChanges();

    expect(compiled.textContent).toContain('Error de contraseña');
  });
});