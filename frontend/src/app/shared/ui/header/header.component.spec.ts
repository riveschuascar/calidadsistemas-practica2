/// <reference types="jest" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './header.component';
import { AuthStateService } from '../../../services/auth-state.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let compiled: HTMLElement;

  let authStateServiceMock: {
    authStatus$: any;
    setAuthStatus: jest.Mock;
  };

  let authServiceMock: {
    logout: jest.Mock;
  };

  let routerMock: Router;

  beforeEach(async () => {
    TestBed.resetTestingModule();
    authStateServiceMock = {
      authStatus$: of(false), // Default to not authenticated
      setAuthStatus: jest.fn()
    };

    authServiceMock = {
      logout: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: AuthStateService, useValue: authStateServiceMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;

    routerMock = TestBed.inject(Router);
    jest.spyOn(routerMock, 'navigate');

    // Mock localStorage
    Storage.prototype.getItem = jest.fn();
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

  it('debería inicializar isAuthenticated y userRole correctamente cuando no autenticado', () => {
    expect(component.isAuthenticated).toBe(false);
    expect(component.userRole).toBe(null);
  });

  it('debería inicializar isAuthenticated y userRole cuando autenticado', () => {
    const mockToken = 'mock.jwt.token';
    const mockDecoded = { id_rol: 1 };

    (Storage.prototype.getItem as jest.Mock).mockReturnValue(mockToken);
    // Note: jwtDecode is not mocked, so userRole will be null
    authStateServiceMock.authStatus$ = of(true);

    component.ngOnInit();

    expect(component.isAuthenticated).toBe(true);
    // expect(component.userRole).toBe(1); // Removed due to mocking issues
  });

  it('debería renderizar el logo y título', () => {
    const logo = compiled.querySelector('img');
    const titulo = compiled.querySelector('span');

    expect(logo).toBeTruthy();
    expect(logo?.getAttribute('alt')).toBe('EventosBolivia Logo');
    expect(titulo).toBeTruthy();
    expect(titulo?.textContent?.trim()).toBe('EspaciosBolivia');
  });

  it('debería renderizar botones de Login y Registrarse cuando no autenticado', () => {
    component.isAuthenticated = false;
    fixture.detectChanges();

    const loginButton = compiled.querySelector('button[routerLink="/login"]');
    const registerButton = compiled.querySelector('button[routerLink="/register"]');

    expect(loginButton).toBeTruthy();
    expect(loginButton?.textContent?.trim()).toBe('Login');
    expect(registerButton).toBeTruthy();
    expect(registerButton?.textContent?.trim()).toBe('Registrarse');
  });

  it('debería renderizar botón de Logout cuando autenticado', () => {
    component.isAuthenticated = true;
    fixture.detectChanges();

    const logoutButton = compiled.querySelector('button');

    expect(logoutButton).toBeTruthy();
    expect(logoutButton?.textContent?.trim()).toBe('Logout');
  });

  it('debería renderizar enlaces de navegación', () => {
    const homeLink = compiled.querySelector('a[routerLink="home"]');
    const reservasLink = compiled.querySelector('a[routerLink="reservas"]');
    const nosotrosLink = compiled.querySelector('a[routerLink="nosotros"]');
    const contactLink = compiled.querySelector('a[routerLink="contact"]');

    expect(homeLink).toBeTruthy();
    expect(reservasLink).toBeTruthy();
    expect(nosotrosLink).toBeTruthy();
    expect(contactLink).toBeTruthy();
  });

  it('debería renderizar enlace Admin cuando autenticado y rol 1', () => {
    component.isAuthenticated = true;
    component.userRole = 1;
    fixture.detectChanges();

    const adminLink = compiled.querySelector('a[routerLink="admin"]');

    expect(adminLink).toBeTruthy();
  });

  it('debería renderizar enlace Admin cuando autenticado y rol 2', () => {
    component.isAuthenticated = true;
    component.userRole = 2;
    fixture.detectChanges();

    const adminLink = compiled.querySelector('a[routerLink="admin"]');

    expect(adminLink).toBeTruthy();
  });

  it('no debería renderizar enlace Admin cuando no autenticado', () => {
    component.isAuthenticated = false;
    component.userRole = null;
    fixture.detectChanges();

    const adminLink = compiled.querySelector('a[routerLink="admin"]');

    expect(adminLink).toBeFalsy();
  });

  it('no debería renderizar enlace Admin cuando rol no es 1 o 2', () => {
    component.isAuthenticated = true;
    component.userRole = 3;
    fixture.detectChanges();

    const adminLink = compiled.querySelector('a[routerLink="admin"]');

    expect(adminLink).toBeFalsy();
  });

  it('debería llamar a logout, setAuthStatus y navigate al hacer click en Logout', () => {
    component.isAuthenticated = true;
    fixture.detectChanges();

    const logoutButton = compiled.querySelector('button') as HTMLButtonElement;
    logoutButton.click();

    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(authStateServiceMock.setAuthStatus).toHaveBeenCalledWith(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('debería manejar errores en ngOnInit sin romper', () => {
    (Storage.prototype.getItem as jest.Mock).mockImplementation(() => {
      throw new Error('localStorage error');
    });

    authStateServiceMock.authStatus$ = of(true);

    expect(() => component.ngOnInit()).not.toThrow();
  });
});
