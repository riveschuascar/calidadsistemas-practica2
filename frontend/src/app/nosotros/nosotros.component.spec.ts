/// <reference types="jest" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NosotrosComponent } from './nosotros.component';

describe('NosotrosComponent', () => {
  let component: NosotrosComponent;
  let fixture: ComponentFixture<NosotrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NosotrosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NosotrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar platformName con el valor esperado', () => {
    expect(component.platformName).toBe('Espacios Bolivia');
  });

  it('debería inicializar purpose con el valor esperado', () => {
    expect(component.purpose).toBe(
      'Contribuir al desarrollo social y cultural de las comunidades, liderando la administración de espacios públicos.'
    );
  });

  it('debería inicializar values con 3 elementos', () => {
    expect(component.values).toBeTruthy();
    expect(component.values.length).toBe(3);
  });

  it('debería inicializar cada valor con icon, title y description', () => {
    component.values.forEach((valor) => {
      expect(valor).toHaveProperty('icon');
      expect(valor).toHaveProperty('title');
      expect(valor).toHaveProperty('description');
      expect(typeof valor.icon).toBe('string');
      expect(typeof valor.title).toBe('string');
      expect(typeof valor.description).toBe('string');
    });
  });

  it('debería inicializar isModalOpen en false', () => {
    expect(component.isModalOpen).toBe(false);
  });

  it('debería inicializar selectedValue en null', () => {
    expect(component.selectedValue).toBeNull();
  });

  it('debería asignar selectedValue y abrir el modal al ejecutar openModal(0)', () => {
    component.openModal(0);

    expect(component.selectedValue).toEqual(component.values[0]);
    expect(component.isModalOpen).toBe(true);
  });

  it('debería asignar selectedValue y abrir el modal al ejecutar openModal(1)', () => {
    component.openModal(1);

    expect(component.selectedValue).toEqual(component.values[1]);
    expect(component.isModalOpen).toBe(true);
  });

  it('debería cerrar el modal y limpiar selectedValue al ejecutar closeModal()', () => {
    component.openModal(0);

    expect(component.isModalOpen).toBe(true);
    expect(component.selectedValue).toEqual(component.values[0]);

    component.closeModal();

    expect(component.isModalOpen).toBe(false);
    expect(component.selectedValue).toBeNull();
  });

  it('debería renderizar el título "Sobre Nosotros"', () => {
    const compilado = fixture.nativeElement as HTMLElement;
    const titulo = compilado.querySelector('h1.title');

    expect(titulo).toBeTruthy();
    expect(titulo?.textContent?.trim()).toBe('Sobre Nosotros');
  });

  it('debería renderizar el subtítulo "Nuestros Valores"', () => {
    const compilado = fixture.nativeElement as HTMLElement;
    const subtitulo = compilado.querySelector('h2.subtitle');

    expect(subtitulo).toBeTruthy();
    expect(subtitulo?.textContent?.trim()).toBe('Nuestros Valores');
  });

  it('debería renderizar la descripción principal', () => {
    const compilado = fixture.nativeElement as HTMLElement;
    const descripcion = compilado.querySelector('p.description');

    expect(descripcion).toBeTruthy();
    expect(descripcion?.textContent).toContain(
      'Espacios Bolivia es una plataforma digital diseñada para optimizar la gestión y reserva de espacios públicos en Cochabamba.'
    );
    expect(descripcion?.textContent).toContain(
      'Contribuir al desarrollo social y cultural de las comunidades, liderando la administración de espacios públicos.'
    );
  });

  it('debería renderizar los valores institucionales en el template', () => {
    const compilado = fixture.nativeElement as HTMLElement;
    const texto = compilado.textContent ?? '';

    expect(texto).toContain('Transparencia');
    expect(texto).toContain('Innovación');
    expect(texto).toContain('Comunidad');
  });

  it('debería renderizar 3 elementos en la lista de valores', () => {
    const compilado = fixture.nativeElement as HTMLElement;
    const items = compilado.querySelectorAll('.values-list li');

    expect(items.length).toBe(3);
  });

  it('debería renderizar 3 imágenes con el alt esperado', () => {
    const compilado = fixture.nativeElement as HTMLElement;
    const imagenes = compilado.querySelectorAll('.values-list img');

    expect(imagenes.length).toBe(3);
    expect(imagenes[0].getAttribute('alt')).toBe('Transparencia');
    expect(imagenes[1].getAttribute('alt')).toBe('Innovación');
    expect(imagenes[2].getAttribute('alt')).toBe('Comunidad');
  });
});