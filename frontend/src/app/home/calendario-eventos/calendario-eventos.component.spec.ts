/// <reference types="jest" />

import { Component, Input, NgModule } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

@Component({
  selector: 'full-calendar',
  template: '',
  standalone: false,
})
class MockFullCalendarComponent {
  @Input() options: any;
}

jest.mock('@fullcalendar/angular', () => {
  @NgModule({
    declarations: [MockFullCalendarComponent],
    exports: [MockFullCalendarComponent],
  })
  class MockFullCalendarModule {}

  return {
    FullCalendarModule: MockFullCalendarModule,
  };
});

jest.mock('@fullcalendar/daygrid', () => ({
  __esModule: true,
  default: {},
}));

jest.mock('@fullcalendar/timegrid', () => ({
  __esModule: true,
  default: {},
}));

jest.mock('@fullcalendar/interaction', () => ({
  __esModule: true,
  default: {},
}));

import { CalendarioEventosComponent } from './calendario-eventos.component';

describe('CalendarioEventosComponent', () => {
  let componente: CalendarioEventosComponent;
  let fixture: ComponentFixture<CalendarioEventosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarioEventosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarioEventosComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear correctamente el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('debería inicializar correctamente calendarOptions', () => {
    expect(componente.calendarOptions).toBeTruthy();
  });

  it('debería establecer initialView como dayGridMonth', () => {
    expect(componente.calendarOptions.initialView).toBe('dayGridMonth');
  });

  it('debería habilitar editable y selectable', () => {
    expect(componente.calendarOptions.editable).toBe(true);
    expect(componente.calendarOptions.selectable).toBe(true);
  });

  it('debería configurar correctamente headerToolbar', () => {
    expect(componente.calendarOptions.headerToolbar).toEqual({
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    });
  });

  it('debería contener eventos predefinidos', () => {
    expect(componente.calendarOptions.events).toBeTruthy();
    expect(componente.calendarOptions.events.length).toBeGreaterThan(0);
  });

  it('debería contener tres eventos predefinidos', () => {
    expect(componente.calendarOptions.events.length).toBe(3);
  });
});