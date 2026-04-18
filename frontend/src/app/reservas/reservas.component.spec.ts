/// <reference types="jest" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { convertToParamMap, ActivatedRoute, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { ReservasComponent } from './reservas.component';
import { EspacioPublicoService } from '../services/espacios-publicos.service';

describe('ReservasComponent', () => {
  let component: ReservasComponent;
  let fixture: ComponentFixture<ReservasComponent>;
  let compiled: HTMLElement;

  let espacioServiceMock: {
    getByType: jest.Mock;
    setEspacioSeleccionado: jest.Mock;
  };

  let routerMock: {
    navigate: jest.Mock;
  };

  const espaciosMock = [
    { _id: '1', nombre: 'Plaza Principal' },
    { _id: '2', nombre: 'Parque Urbano' }
  ];

  beforeEach(async () => {
    espacioServiceMock = {
      getByType: jest.fn().mockResolvedValue(espaciosMock),
      setEspacioSeleccionado: jest.fn()
    };

    routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ReservasComponent],
      providers: [
        { provide: EspacioPublicoService, useValue: espacioServiceMock },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ tipo: 'plaza' }))
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReservasComponent);
    component = fixture.componentInstance;

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

  it('debería inicializar tipo vacío y espacios como arreglo vacío antes de cargar datos', () => {
    const nuevoComponente = new ReservasComponent(
      {
        paramMap: of(convertToParamMap({ tipo: 'plaza' }))
      } as any,
      routerMock as any,
      espacioServiceMock as any
    );

    expect(nuevoComponente.tipo).toBe('');
    expect(nuevoComponente.espacios).toEqual([]);
  });

  it('debería obtener el parámetro tipo desde ActivatedRoute en ngOnInit', () => {
    expect(component.tipo).toBe('plaza');
  });

  it('debería llamar a cargarEspaciosPorTipo con el tipo recibido', async () => {
    const spy = jest.spyOn(component, 'cargarEspaciosPorTipo');

    component.ngOnInit();
    await fixture.whenStable();

    expect(spy).toHaveBeenCalledWith('plaza');
  });

  it('debería llamar a getByType con el tipo correcto', () => {
    expect(espacioServiceMock.getByType).toHaveBeenCalledWith('plaza');
  });

  it('debería cargar correctamente los espacios cuando el servicio responde', () => {
    expect(component.espacios).toEqual(espaciosMock);
  });

  it('debería manejar errores del servicio sin romper la ejecución', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    espacioServiceMock.getByType.mockRejectedValueOnce(new Error('Error al cargar'));

    const fixtureError = TestBed.createComponent(ReservasComponent);
    const componentError = fixtureError.componentInstance;

    fixtureError.detectChanges();
    await fixtureError.whenStable();

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(componentError.espacios).toEqual([]);
  });

  it('debería ejecutar seleccionarEspacio y navegar a /formulario', () => {
    const espacio = espaciosMock[0];

    component.seleccionarEspacio(espacio);

    expect(espacioServiceMock.setEspacioSeleccionado).toHaveBeenCalledWith(espacio);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/formulario']);
  });

  it('debería navegar a /reservas/${tipo} al ejecutar navigateToSpaces', () => {
    component.navigateToSpaces('deportivo');

    expect(routerMock.navigate).toHaveBeenCalledWith(['/reservas/deportivo']);
  });

  it('debería renderizar el título dinámico con el tipo en titlecase', () => {
    const titulo = compiled.querySelector('h1');

    expect(titulo).toBeTruthy();
    expect(titulo?.textContent?.trim()).toBe('Espacios Públicos: Plaza');
  });

  it('debería renderizar la cantidad correcta de espacios en la lista', () => {
    const items = compiled.querySelectorAll('ul li');

    expect(items.length).toBe(2);
  });

  it('debería renderizar los nombres de los espacios y sus botones Seleccionar', () => {
    const texto = compiled.textContent || '';
    const botones = Array.from(compiled.querySelectorAll('ul li button')).map(btn =>
      btn.textContent?.trim()
    );

    expect(texto).toContain('Plaza Principal');
    expect(texto).toContain('Parque Urbano');
    expect(botones).toEqual(['Seleccionar', 'Seleccionar']);
  });

  it('debería invocar seleccionarEspacio al hacer clic en un botón Seleccionar', () => {
    const spy = jest.spyOn(component, 'seleccionarEspacio');
    const botones = fixture.debugElement.queryAll(By.css('ul li button'));

    botones[0].triggerEventHandler('click', null);

    expect(spy).toHaveBeenCalledWith(espaciosMock[0]);
  });

  it('debería renderizar los tres botones principales de categorías', () => {
    const botones = compiled.querySelectorAll('.container-buttons .espacio-btn');

    expect(botones.length).toBe(3);
    expect(compiled.textContent).toContain('Plazas');
    expect(compiled.textContent).toContain('Áreas Deportivas');
    expect(compiled.textContent).toContain('Cultural');
  });

  it('debería renderizar los routerLink esperados en los botones principales', () => {
    const botones = compiled.querySelectorAll('.container-buttons .espacio-btn');

    expect(botones[0].getAttribute('ng-reflect-router-link')).toContain('/reservas/plazas');
    expect(botones[1].getAttribute('ng-reflect-router-link')).toContain('/reservas/areas-deportivas');
    expect(botones[2].getAttribute('ng-reflect-router-link')).toContain('/reservas/cultural');
  });

  it('no debería llamar cargarEspaciosPorTipo cuando tipo viene vacío', async () => {
  await TestBed.resetTestingModule();

  await TestBed.configureTestingModule({
    imports: [ReservasComponent],
    providers: [
      { provide: EspacioPublicoService, useValue: espacioServiceMock },
      { provide: Router, useValue: routerMock },
      {
        provide: ActivatedRoute,
        useValue: {
          paramMap: of(convertToParamMap({}))
        }
      }
    ]
  }).compileComponents();

  const fixtureNuevo = TestBed.createComponent(ReservasComponent);
  const componenteNuevo = fixtureNuevo.componentInstance;
  const spy = jest.spyOn(componenteNuevo, 'cargarEspaciosPorTipo');

  fixtureNuevo.detectChanges();
  await fixtureNuevo.whenStable();

  expect(componenteNuevo.tipo).toBe('');
  expect(spy).not.toHaveBeenCalled();
  });
});