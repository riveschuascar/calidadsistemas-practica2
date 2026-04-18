/// <reference types="jest" />

import { TestBed } from '@angular/core/testing';
import { AuthStateService } from './auth-state.service';

describe('AuthStateService', () => {
  let service: AuthStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthStateService);
  });

  it('debería crear el servicio correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería emitir false como estado inicial de autenticación', done => {
    service.authStatus$.subscribe(value => {
      expect(value).toBe(false);
      done();
    });
  });

  it('debería emitir true cuando se actualiza el estado a autenticado', done => {
    const valores: boolean[] = [];

    const sub = service.authStatus$.subscribe(value => {
      valores.push(value);

      if (valores.length === 2) {
        expect(valores).toEqual([false, true]);
        sub.unsubscribe();
        done();
      }
    });

    service.setAuthStatus(true);
  });

  it('debería emitir false cuando se actualiza el estado a no autenticado', done => {
    service.setAuthStatus(true);

    const valores: boolean[] = [];

    const sub = service.authStatus$.subscribe(value => {
      valores.push(value);

      if (valores.length === 2) {
        expect(valores).toEqual([true, false]);
        sub.unsubscribe();
        done();
      }
    });

    service.setAuthStatus(false);
  });

  it('debería emitir los cambios de estado en el orden correcto', done => {
    const valores: boolean[] = [];

    const sub = service.authStatus$.subscribe(value => {
      valores.push(value);

      if (valores.length === 4) {
        expect(valores).toEqual([false, true, false, true]);
        sub.unsubscribe();
        done();
      }
    });

    service.setAuthStatus(true);
    service.setAuthStatus(false);
    service.setAuthStatus(true);
  });
});