/// <reference types="jest" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactComponent } from './contact.component';
import { By } from '@angular/platform-browser';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar contactData con valores vacíos', () => {
    expect(component.contactData).toEqual({
      name: '',
      email: '',
      message: ''
    });
  });

  it('debería renderizar el título "Contáctanos"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('h1');

    expect(title).toBeTruthy();
    expect(title?.textContent?.trim()).toBe('Contáctanos');
  });

  it('debería renderizar la descripción', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const description = compiled.querySelector('.description');

    expect(description).toBeTruthy();
    expect(description?.textContent).toContain(
      'Si tienes preguntas o necesitas más información'
    );
  });

  it('debería renderizar los campos name, email y message', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('input[name="name"]')).toBeTruthy();
    expect(compiled.querySelector('input[name="email"]')).toBeTruthy();
    expect(compiled.querySelector('textarea[name="message"]')).toBeTruthy();
  });

  it('debería renderizar el botón Enviar', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button[type="submit"]');

    expect(button).toBeTruthy();
    expect(button?.textContent?.trim()).toBe('Enviar');
  });

  it('debería tener el botón deshabilitado cuando el formulario está vacío', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBe(true);
  });

  it('debería habilitar el botón cuando el formulario es válido', async () => {
    component.contactData.name = 'Mauricio';
    component.contactData.email = 'mauricio@test.com';
    component.contactData.message = 'Hola, necesito información';

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBe(false);
  });

  it('debería actualizar contactData.name al escribir en el input', async () => {
    const input = fixture.debugElement.query(By.css('input[name="name"]')).nativeElement;
    input.value = 'Mauricio';
    input.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.contactData.name).toBe('Mauricio');
  });

  it('debería actualizar contactData.email al escribir en el input', async () => {
    const input = fixture.debugElement.query(By.css('input[name="email"]')).nativeElement;
    input.value = 'mauricio@test.com';
    input.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.contactData.email).toBe('mauricio@test.com');
  });

  it('debería actualizar contactData.message al escribir en el textarea', async () => {
    const textarea = fixture.debugElement.query(By.css('textarea[name="message"]')).nativeElement;
    textarea.value = 'Mensaje de prueba';
    textarea.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.contactData.message).toBe('Mensaje de prueba');
  });

  it('debería ejecutar console.log con contactData al enviar el formulario', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    component.contactData = {
      name: 'Mauricio',
      email: 'mauricio@test.com',
      message: 'Hola, necesito ayuda'
    };

    component.onSubmit();

    expect(consoleSpy).toHaveBeenCalledWith({
      name: 'Mauricio',
      email: 'mauricio@test.com',
      message: 'Hola, necesito ayuda'
    });

    consoleSpy.mockRestore();
  });
});