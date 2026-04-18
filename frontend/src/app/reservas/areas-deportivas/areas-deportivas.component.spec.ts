/// <reference types="jest" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AreasDeportivasComponent } from './areas-deportivas.component';

describe('AreasDeportivasComponent', () => {
  let component: AreasDeportivasComponent;
  let fixture: ComponentFixture<AreasDeportivasComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreasDeportivasComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AreasDeportivasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement as HTMLElement;
  });

  it('debería crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería renderizar el template sin errores', () => {
    expect(compiled).toBeTruthy();
  });

  it('debería renderizar el contenido estático actual del HTML', () => {
    expect(compiled.textContent).toContain('jklahsdlkasdlkjasldkjasldkj');
  });

  it('debería contener un body en el template renderizado', () => {
    const body = compiled.querySelector('body');

    expect(body).toBeTruthy();
  });

  it('no debería lanzar errores al ejecutar detectChanges', () => {
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});