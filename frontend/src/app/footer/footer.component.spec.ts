/// <reference types="jest" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería renderizar el texto del footer', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const text = compiled.querySelector('p');

    expect(text).toBeTruthy();
    expect(text?.textContent?.trim()).toBe('Eventos Bolivia © 2024');
  });

  it('debería renderizar la lista de enlaces', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const list = compiled.querySelector('.footer-links');

    expect(list).toBeTruthy();
  });

  it('debería tener 3 enlaces en el footer', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('.footer-links a');

    expect(links.length).toBe(3);
  });

  it('debería contener los textos correctos en los enlaces', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const links = Array.from(compiled.querySelectorAll('.footer-links a'))
      .map(link => link.textContent?.trim());

    expect(links).toEqual([
      'Support',
      'Help Center',
      'User Manual'
    ]);
  });

  it('debería verificar que los enlaces tienen atributo href', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('.footer-links a');

    links.forEach(link => {
      expect(link.getAttribute('href')).toBeTruthy();
    });
  });
});