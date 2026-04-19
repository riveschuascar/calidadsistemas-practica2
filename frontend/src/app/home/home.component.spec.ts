/// <reference types="jest" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { EspacioPublicoService } from './../services/espacios-publicos.service';
import { provideRouter } from '@angular/router';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let espacioServicioMock: { getAll: jest.Mock };

  const espaciosMock = [
    { nombre: 'Espacio 1', url_imagen: 'img1.jpg' },
    { nombre: 'Espacio 2', url_imagen: 'img2.jpg' },
    { nombre: 'Espacio 3', url_imagen: 'img3.jpg' }
  ];

  beforeEach(async () => {
    espacioServicioMock = {
      getAll: jest.fn().mockResolvedValue(espaciosMock)
    };

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([]),
        { provide: EspacioPublicoService, useValue: espacioServicioMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    jest.spyOn(component, 'startAutoSlide').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar highlights con 3 elementos', () => {
    expect(component.highlights.length).toBe(3);
  });

  it('debería renderizar el título principal', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('h1');

    expect(title).toBeTruthy();
    expect(title?.textContent?.trim()).toBe('Bienvenido a Espacios Bolivia');
  });

  it('debería renderizar el texto descriptivo principal', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Facilitando el acceso a espacios públicos para todos.');
  });

  it('debería renderizar los botones principales', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = Array.from(compiled.querySelectorAll('button')).map(btn =>
      btn.textContent?.trim()
    );

    expect(buttons).toContain('Explorar');
    expect(buttons).toContain('Galería');
    expect(buttons).toContain('Calendario de Eventos');
  });

  it('debería renderizar 3 tarjetas de highlights', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('.highlight-card');

    expect(cards.length).toBe(3);
  });

  it('debería llamar a getAll() en ngOnInit()', async () => {
    fixture.detectChanges();
    await Promise.resolve();

    expect(espacioServicioMock.getAll).toHaveBeenCalled();
    expect(component.startAutoSlide).toHaveBeenCalled();
  });

  it('debería cargar los datos en carousel cuando el servicio responde correctamente', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await component.ngOnInit();

    expect(component.carousel).toEqual(espaciosMock);
    expect(component.startAutoSlide).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith('Datos cargados correctamente', espaciosMock);

    logSpy.mockRestore();
  });

  it('debería ejecutar console.error si el servicio falla', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    espacioServicioMock.getAll.mockRejectedValue(new Error('Error de servicio'));

    await component.ngOnInit();

    expect(errorSpy).toHaveBeenCalledWith(
      'Error al cargar los espacios publicos:',
      expect.any(Error)
    );

    errorSpy.mockRestore();
  });

  it('debería llamar a scrollIntoView cuando el elemento existe', () => {
    const mockScrollIntoView = jest.fn();
    const getElementByIdSpy = jest.spyOn(document, 'getElementById').mockReturnValue({
      scrollIntoView: mockScrollIntoView
    } as any);

    component.scrollTo('highlights');

    expect(getElementByIdSpy).toHaveBeenCalledWith('highlights');
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });

    getElementByIdSpy.mockRestore();
  });

  it('no debería fallar si el elemento no existe en scrollTo()', () => {
    const getElementByIdSpy = jest.spyOn(document, 'getElementById').mockReturnValue(null);

    expect(() => component.scrollTo('no-existe')).not.toThrow();

    getElementByIdSpy.mockRestore();
  });

  it('debería avanzar el currentIndex con nextSlide()', () => {
    component.currentIndex = 0;
    component.visibleItems = 2;

    component.nextSlide();

    expect(component.currentIndex).toBe(1);
  });

  it('debería retroceder el currentIndex con prevSlide()', () => {
    component.currentIndex = 1;
    component.visibleItems = 2;

    component.prevSlide();

    expect(component.currentIndex).toBe(0);
  });

  it('debería llamar a setInterval en startAutoSlide()', () => {
    const startAutoSlideReal = HomeComponent.prototype.startAutoSlide;
    const intervalSpy = jest.spyOn(global, 'setInterval');

    startAutoSlideReal.call(component);

    expect(intervalSpy).toHaveBeenCalled();

    intervalSpy.mockRestore();
    component.stopAutoSlide();
  });

  it('debería llamar a clearInterval en stopAutoSlide()', () => {
    const clearSpy = jest.spyOn(global, 'clearInterval');
    component.interval = 123;

    component.stopAutoSlide();

    expect(clearSpy).toHaveBeenCalledWith(123);

    clearSpy.mockRestore();
  });
});