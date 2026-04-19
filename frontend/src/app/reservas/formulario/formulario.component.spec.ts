/// <reference types="jest" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormularioComponent } from './formulario.component';
import { EspacioPublicoService } from '../../services/espacios-publicos.service';
import { ReservaService } from '../../services/reserva.service';

describe('FormularioComponent', () => {
  let component: FormularioComponent;
  let fixture: ComponentFixture<FormularioComponent>;
  let compiled: HTMLElement;

  let espacioServiceMock: {
    getEspacioSeleccionado: jest.Mock;
  };

  let reservaServiceMock: {
    postReserva: jest.Mock;
  };

  const espacioMock = {
    _id: 'espacio-123',
    nombre: 'Cancha Central',
    data: {
      descripcion: 'Espacio deportivo'
    }
  };

  beforeEach(async () => {
    espacioServiceMock = {
      getEspacioSeleccionado: jest.fn().mockReturnValue(espacioMock)
    };

    reservaServiceMock = {
      postReserva: jest.fn().mockResolvedValue({ ok: true, id: 'reserva-1' })
    };

    await TestBed.configureTestingModule({
      imports: [FormularioComponent],
      providers: [
        { provide: EspacioPublicoService, useValue: espacioServiceMock },
        { provide: ReservaService, useValue: reservaServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioComponent);
    component = fixture.componentInstance;

    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.useFakeTimers();

    fixture.detectChanges();
    compiled = fixture.nativeElement as HTMLElement;
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('debería crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar mostrarMensaje en false', () => {
    expect(component.mostrarMensaje).toBe(false);
  });

  it('debería obtener el espacio seleccionado en ngOnInit', () => {
    expect(espacioServiceMock.getEspacioSeleccionado).toHaveBeenCalled();
    expect(component.espacio).toEqual(espacioMock);
  });

  it('debería manejar el caso cuando no hay espacio seleccionado', async () => {
    espacioServiceMock.getEspacioSeleccionado.mockReturnValueOnce(null);

    const fixtureSinEspacio = TestBed.createComponent(FormularioComponent);
    const componentSinEspacio = fixtureSinEspacio.componentInstance;
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    fixtureSinEspacio.detectChanges();

    expect(componentSinEspacio.espacio).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith('No hay espacio seleccionado.');
  });

  it('debería renderizar el título con el nombre del espacio', () => {
    const titulo = compiled.querySelector('h2');

    expect(titulo).toBeTruthy();
    expect(titulo?.textContent).toContain('Formulario de Reserva: Cancha Central');
  });

  it('debería renderizar el formulario y sus campos principales', () => {
    expect(compiled.querySelector('form')).toBeTruthy();
    expect(compiled.querySelector('#ci')).toBeTruthy();
    expect(compiled.querySelector('#tipo-evento')).toBeTruthy();
    expect(compiled.querySelector('#fecha')).toBeTruthy();
    expect(compiled.querySelector('#tarjeta')).toBeTruthy();
  });

  it('debería renderizar el botón "Reservar" de tipo submit', () => {
    const boton = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;

    expect(boton).toBeTruthy();
    expect(boton.textContent?.trim()).toBe('Reservar');
    expect(boton.type).toBe('submit');
  });

  it('debería renderizar la imagen del mapa', () => {
    const imagen = compiled.querySelector('img') as HTMLImageElement;

    expect(imagen).toBeTruthy();
    expect(imagen.alt).toBe('Ubicación del espacio reservado en La Paz');
  });

  it('debería invocar reservar cuando se llama ngSubmit()', () => {
    const spy = jest.spyOn(component, 'reservar').mockResolvedValue(undefined);

    component.ngSubmit();

    expect(spy).toHaveBeenCalled();
  });

  it('debería enviar la reserva con el objeto esperado', async () => {
    component.reserva = {
      nombre: '',
      ci: '123456',
      otb: '',
      tipoEvento: 'Campeonato',
      sector: '',
      fecha: '2026-05-10',
      tarjeta: '1234123412341234'
    };

    await component.reservar();

    expect(reservaServiceMock.postReserva).toHaveBeenCalledWith({
      usuario: 123456,
      espacio_publico: 'espacio-123',
      fecha: '2026-05-10',
      hora_inicio: '8:00:00',
      hora_fin: '18:00:00'
    });
  });

  it('debería mostrar el mensaje de confirmación cuando la reserva es exitosa', async () => {
    component.reserva = {
      nombre: '',
      ci: '123456',
      otb: '',
      tipoEvento: 'Campeonato',
      sector: '',
      fecha: '2026-05-10',
      tarjeta: '1234123412341234'
    };

    await component.reservar();

    expect(component.mostrarMensaje).toBe(true);
  });

  it('debería ocultar el mensaje de confirmación después de 3 segundos', async () => {
    component.reserva = {
      nombre: '',
      ci: '123456',
      otb: '',
      tipoEvento: 'Campeonato',
      sector: '',
      fecha: '2026-05-10',
      tarjeta: '1234123412341234'
    };

    await component.reservar();
    expect(component.mostrarMensaje).toBe(true);

    jest.advanceTimersByTime(3000);

    expect(component.mostrarMensaje).toBe(false);
  });

  it('debería lanzar error cuando postReserva falla', async () => {
    reservaServiceMock.postReserva.mockRejectedValueOnce(new Error('Error al reservar'));

    component.reserva = {
      nombre: '',
      ci: '123456',
      otb: '',
      tipoEvento: 'Campeonato',
      sector: '',
      fecha: '2026-05-10',
      tarjeta: '1234123412341234'
    };

    await expect(component.reservar()).rejects.toThrow('Error al reservar');
  });

  it('debería mostrar el overlay cuando mostrarMensaje es true', () => {
    component.mostrarMensaje = true;
    fixture.detectChanges();

    const overlay = fixture.nativeElement.querySelector('.overlay');
    const mensaje = fixture.nativeElement.querySelector('.mensaje');

    expect(overlay).toBeTruthy();
    expect(mensaje?.textContent).toContain('Solicitud Enviada');
  });

  it('no debería mostrar el overlay cuando mostrarMensaje es false', () => {
    component.mostrarMensaje = false;
    fixture.detectChanges();

    const overlay = fixture.nativeElement.querySelector('.overlay');

    expect(overlay).toBeNull();
  });
});