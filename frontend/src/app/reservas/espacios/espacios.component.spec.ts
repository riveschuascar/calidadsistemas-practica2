/// <reference types="jest" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { convertToParamMap, ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { EspaciosComponent } from './espacios.component';
import { EspacioPublicoService } from '../../services/espacios-publicos.service';

describe('EspaciosComponent', () => {
  let component: EspaciosComponent;
  let fixture: ComponentFixture<EspaciosComponent>;
  let compiled: HTMLElement;

  let espacioPublicoServiceMock: {
    getByType: jest.Mock;
    setEspacioSeleccionado: jest.Mock;
  };

  const espaciosMock = [
    {
      _id: '1',
      nombre: 'Cancha Norte',
      url_imagen: 'https://example.com/cancha-norte.jpg'
    },
    {
      _id: '2',
      nombre: 'Cancha Sur',
      url_imagen: 'https://example.com/cancha-sur.jpg'
    }
  ];

  beforeEach(async () => {
    espacioPublicoServiceMock = {
      getByType: jest.fn().mockResolvedValue(espaciosMock),
      setEspacioSeleccionado: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [EspaciosComponent],
      providers: [
        { provide: EspacioPublicoService, useValue: espacioPublicoServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of(convertToParamMap({ tipo: 'deporte' }))
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EspaciosComponent);
    component = fixture.componentInstance;

    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    compiled = fixture.nativeElement as HTMLElement;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('debería crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar espacios como arreglo vacío antes de cargar datos', () => {
    const nuevoComponente = new EspaciosComponent(
      espacioPublicoServiceMock as any,
      {
        queryParamMap: of(convertToParamMap({ tipo: 'deporte' }))
      } as any
    );

    expect(nuevoComponente.espacios).toEqual([]);
    expect(nuevoComponente.tipo).toBe('');
  });

  it('debería obtener el tipo desde ActivatedRoute en ngOnInit', () => {
    expect(component.tipo).toBe('deporte');
  });

  it('debería llamar a getByType con el tipo recibido', () => {
    expect(espacioPublicoServiceMock.getByType).toHaveBeenCalledWith('deporte');
  });

  it('debería cargar correctamente los espacios cuando el servicio responde', () => {
    expect(component.espacios).toEqual(espaciosMock);
  });

  it('debería manejar errores del servicio sin romper la ejecución', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    espacioPublicoServiceMock.getByType.mockRejectedValueOnce(new Error('Error de carga'));

    const fixtureError = TestBed.createComponent(EspaciosComponent);
    const componentError = fixtureError.componentInstance;

    fixtureError.detectChanges();
    await fixtureError.whenStable();

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(componentError.espacios).toEqual([]);
  });

  it('debería ejecutar selecEspacio y guardar el espacio seleccionado en el servicio', () => {
    const espacio = espaciosMock[0];

    component.selecEspacio(espacio);

    expect(espacioPublicoServiceMock.setEspacioSeleccionado).toHaveBeenCalledWith(espacio);
  });

  it('debería renderizar la cantidad correcta de espacios en el template', () => {
    const tarjetas = compiled.querySelectorAll('.espacio');

    expect(tarjetas.length).toBe(2);
  });

  it('debería renderizar nombre e imagen de cada espacio', () => {
    const nombres = Array.from(compiled.querySelectorAll('.espacio h3')).map(el =>
      el.textContent?.trim()
    );
    const imagenes = compiled.querySelectorAll('.espacio img');

    expect(nombres).toContain('Cancha Norte');
    expect(nombres).toContain('Cancha Sur');

    expect(imagenes.length).toBe(2);
    expect(imagenes[0].getAttribute('src')).toBe('https://example.com/cancha-norte.jpg');
    expect(imagenes[1].getAttribute('src')).toBe('https://example.com/cancha-sur.jpg');
  });

  it('debería usar el alt del nombre cuando el espacio tiene nombre', () => {
    const imagenes = compiled.querySelectorAll('.espacio img');

    expect(imagenes[0].getAttribute('alt')).toBe('Cancha Norte');
    expect(imagenes[1].getAttribute('alt')).toBe('Cancha Sur');
  });

  it('debería renderizar el texto "Reservar" en cada botón', () => {
    const botones = Array.from(compiled.querySelectorAll('.espacio button')).map(btn =>
      btn.textContent?.trim()
    );

    expect(botones).toEqual(['Reservar', 'Reservar']);
  });

  it('debería renderizar el atributo ng-reflect-router-link del botón en entorno de prueba', () => {
    const botones = compiled.querySelectorAll('.espacio button');

    expect(botones.length).toBe(2);
    expect(botones[0].getAttribute('ng-reflect-router-link')).toContain('/reservas/formulario,1');
    expect(botones[1].getAttribute('ng-reflect-router-link')).toContain('/reservas/formulario,2');
  });

  it('debería invocar selecEspacio desde el evento click del botón reservar', () => {
    const spy = jest.spyOn(component, 'selecEspacio');
    const botones = fixture.debugElement.queryAll(By.css('.espacio button'));

    botones[0].triggerEventHandler('click', null);

    expect(spy).toHaveBeenCalledWith(espaciosMock[0]);
  });
});