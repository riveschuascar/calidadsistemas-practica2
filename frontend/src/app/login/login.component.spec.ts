/// <reference types="jest" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../services/auth.service';
import { Router, provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;

  let authServiceMock: {
    login: jest.Mock;
    saveToken: jest.Mock;
  };

  beforeEach(async () => {
    authServiceMock = {
      login: jest.fn(),
      saveToken: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar loginData vacío', () => {
    expect(component.loginData).toEqual({
      email: '',
      password: ''
    });
  });

  it('debería renderizar el título', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('h2');

    expect(title?.textContent?.trim()).toBe('Iniciar Sesión');
  });

  it('debería renderizar inputs y botón', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('input[name="email"]')).toBeTruthy();
    expect(compiled.querySelector('input[name="password"]')).toBeTruthy();
    expect(compiled.querySelector('button[type="submit"]')).toBeTruthy();
  });

  it('debería actualizar loginData con ngModel', async () => {
    const emailInput = fixture.debugElement.query(By.css('input[name="email"]')).nativeElement;
    emailInput.value = 'test@test.com';
    emailInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.loginData.email).toBe('test@test.com');
  });

  it('debería hacer login exitoso', async () => {
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

    authServiceMock.login.mockResolvedValue({
      access_token: '123'
    });

    component.loginData = {
      email: 'test@test.com',
      password: '123456'
    };

    await component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalledWith('test@test.com', '123456');
    expect(authServiceMock.saveToken).toHaveBeenCalledWith('123');
    expect(navigateSpy).toHaveBeenCalledWith(['/home']);
  });

  it('debería manejar error en login fallido', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    authServiceMock.login.mockRejectedValue(new Error('Error'));

    await component.onSubmit();

    expect(component.errorMessage).toBe('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
    expect(errorSpy).toHaveBeenCalled();

    errorSpy.mockRestore();
  });

  it('debería validar contraseñas diferentes en registro', async () => {
    component.registerData = {
      email: 'test@test.com',
      password: '123',
      confirmPassword: '456'
    };

    await component.onRegisterSubmit();

    expect(component.errorMessage).toBe('Las contraseñas no coinciden.');
  });

  it('debería cambiar estado con toggleRegister()', () => {
    const initial = component.isRegistering;
    component.errorMessage = 'Error previo';

    component.toggleRegister();

    expect(component.isRegistering).toBe(!initial);
    expect(component.errorMessage).toBe('');
  });
});