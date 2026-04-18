/// <reference types="jest" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagoComponent } from './pago.component';

describe('PagoComponent', () => {
  let component: PagoComponent;
  let fixture: ComponentFixture<PagoComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement as HTMLElement;
  });

  it('debería crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería renderizar el contenedor principal con la clase payment-container', () => {
    const contenedor = compiled.querySelector('section.payment-container');

    expect(contenedor).toBeTruthy();
  });

  it('debería renderizar el título "Espacios Bolivia"', () => {
    const titulo = compiled.querySelector('h2');

    expect(titulo).toBeTruthy();
    expect(titulo?.textContent?.trim()).toBe('Espacios Bolivia');
  });

  it('debería renderizar un formulario', () => {
    const formulario = compiled.querySelector('form');

    expect(formulario).toBeTruthy();
  });

  it('debería renderizar exactamente cinco inputs en el formulario', () => {
    const inputs = compiled.querySelectorAll('input');

    expect(inputs.length).toBe(5);
  });

  it('debería renderizar el input de correo electrónico con los atributos esperados', () => {
    const inputEmail = compiled.querySelector('#email') as HTMLInputElement;

    expect(inputEmail).toBeTruthy();
    expect(inputEmail.type).toBe('email');
    expect(inputEmail.id).toBe('email');
    expect(inputEmail.placeholder).toBe('Ingrese su correo electronico');
    expect(inputEmail.required).toBe(true);
  });

  it('debería renderizar el label del correo electrónico correctamente', () => {
    const labelEmail = compiled.querySelector('label[for="email"]');

    expect(labelEmail).toBeTruthy();
    expect(labelEmail?.textContent?.trim()).toBe('Correo Electrónico:');
  });

  it('debería renderizar el input de número de tarjeta con los atributos esperados', () => {
    const inputTarjeta = compiled.querySelector('#cardNumber') as HTMLInputElement;

    expect(inputTarjeta).toBeTruthy();
    expect(inputTarjeta.type).toBe('text');
    expect(inputTarjeta.id).toBe('cardNumber');
    expect(inputTarjeta.placeholder).toBe('0000/0000/0000/0000');
    expect(inputTarjeta.maxLength).toBe(19);
    expect(inputTarjeta.required).toBe(true);
  });

  it('debería renderizar el label del número de tarjeta correctamente', () => {
    const labelTarjeta = compiled.querySelector('label[for="cardNumber"]');

    expect(labelTarjeta).toBeTruthy();
    expect(labelTarjeta?.textContent?.trim()).toBe('Número de Tarjeta:');
  });

  it('debería renderizar el input de fecha de expiración con los atributos esperados', () => {
    const inputFecha = compiled.querySelector('#expiryDate') as HTMLInputElement;

    expect(inputFecha).toBeTruthy();
    expect(inputFecha.type).toBe('text');
    expect(inputFecha.id).toBe('expiryDate');
    expect(inputFecha.placeholder).toBe('MM/AA');
    expect(inputFecha.maxLength).toBe(5);
    expect(inputFecha.required).toBe(true);
  });

  it('debería renderizar el label de fecha de expiración correctamente', () => {
    const labelFecha = compiled.querySelector('label[for="expiryDate"]');

    expect(labelFecha).toBeTruthy();
    expect(labelFecha?.textContent?.trim()).toBe('Fecha de Expiración:');
  });

  it('debería renderizar el input de CVV con los atributos esperados', () => {
    const inputCvv = compiled.querySelector('#cvv') as HTMLInputElement;

    expect(inputCvv).toBeTruthy();
    expect(inputCvv.type).toBe('text');
    expect(inputCvv.id).toBe('cvv');
    expect(inputCvv.placeholder).toBe('000');
    expect(inputCvv.maxLength).toBe(3);
    expect(inputCvv.required).toBe(true);
  });

  it('debería renderizar el label de CVV correctamente', () => {
    const labelCvv = compiled.querySelector('label[for="cvv"]');

    expect(labelCvv).toBeTruthy();
    expect(labelCvv?.textContent?.trim()).toBe('CVV:');
  });

  it('debería renderizar la sección de detalles de tarjeta', () => {
    const detallesTarjeta = compiled.querySelector('.card-details');

    expect(detallesTarjeta).toBeTruthy();
  });

  it('debería renderizar el checkbox de recordatorio correctamente', () => {
    const checkbox = compiled.querySelector('#remember') as HTMLInputElement;

    expect(checkbox).toBeTruthy();
    expect(checkbox.type).toBe('checkbox');
    expect(checkbox.id).toBe('remember');
    expect(checkbox.checked).toBe(false);
  });

  it('debería renderizar el label del checkbox correctamente', () => {
    const labelRemember = compiled.querySelector('label[for="remember"]');

    expect(labelRemember).toBeTruthy();
    expect(labelRemember?.textContent?.trim()).toBe('Recuérdame');
  });

  it('debería renderizar la sección remember-me', () => {
    const seccionRemember = compiled.querySelector('.remember-me');

    expect(seccionRemember).toBeTruthy();
  });

  it('debería renderizar el botón de confirmar pago con type submit', () => {
    const boton = compiled.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;

    expect(boton).toBeTruthy();
    expect(boton.type).toBe('submit');
    expect(boton.textContent?.trim()).toBe('Confirmar Pago');
  });

  it('debería renderizar exactamente cinco labels en el formulario', () => {
    const labels = compiled.querySelectorAll('label');

    expect(labels.length).toBe(5);
  });

  it('debería renderizar los placeholders correctos en los campos principales', () => {
    const inputEmail = compiled.querySelector('#email') as HTMLInputElement;
    const inputTarjeta = compiled.querySelector('#cardNumber') as HTMLInputElement;
    const inputFecha = compiled.querySelector('#expiryDate') as HTMLInputElement;
    const inputCvv = compiled.querySelector('#cvv') as HTMLInputElement;

    expect(inputEmail.placeholder).toBe('Ingrese su correo electronico');
    expect(inputTarjeta.placeholder).toBe('0000/0000/0000/0000');
    expect(inputFecha.placeholder).toBe('MM/AA');
    expect(inputCvv.placeholder).toBe('000');
  });

  it('debería marcar como requeridos los cuatro campos principales del formulario', () => {
    const inputEmail = compiled.querySelector('#email') as HTMLInputElement;
    const inputTarjeta = compiled.querySelector('#cardNumber') as HTMLInputElement;
    const inputFecha = compiled.querySelector('#expiryDate') as HTMLInputElement;
    const inputCvv = compiled.querySelector('#cvv') as HTMLInputElement;

    expect(inputEmail.required).toBe(true);
    expect(inputTarjeta.required).toBe(true);
    expect(inputFecha.required).toBe(true);
    expect(inputCvv.required).toBe(true);
  });

  it('debería tener los maxlength correctos en tarjeta, fecha y cvv', () => {
    const inputTarjeta = compiled.querySelector('#cardNumber') as HTMLInputElement;
    const inputFecha = compiled.querySelector('#expiryDate') as HTMLInputElement;
    const inputCvv = compiled.querySelector('#cvv') as HTMLInputElement;

    expect(inputTarjeta.maxLength).toBe(19);
    expect(inputFecha.maxLength).toBe(5);
    expect(inputCvv.maxLength).toBe(3);
  });
});