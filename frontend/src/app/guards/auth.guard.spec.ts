/// <reference types="jest" />
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceMock: { isAuthenticated: jest.Mock };
  let routerMock: { navigate: jest.Mock };

  beforeEach(() => {
    authServiceMock = {
      isAuthenticated: jest.fn()
    };

    routerMock = {
      navigate: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería crear el guard correctamente', () => {
    expect(guard).toBeTruthy();
  });

  it('debería retornar true cuando el usuario está autenticado', () => {
    authServiceMock.isAuthenticated.mockReturnValue(true);

    const result = guard.canActivate();

    expect(result).toBe(true);
    expect(authServiceMock.isAuthenticated).toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('debería retornar false cuando el usuario no está autenticado', () => {
    authServiceMock.isAuthenticated.mockReturnValue(false);

    const result = guard.canActivate();

    expect(result).toBe(false);
    expect(authServiceMock.isAuthenticated).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});