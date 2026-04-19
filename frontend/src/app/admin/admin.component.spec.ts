/// <reference types="jest" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminComponent } from './admin.component';
import { UsuariosService } from '../services/usuarios.service';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let usuariosServiceMock: { getUsuarios: jest.Mock };

  const usuariosMock = [
    {
      ci_usuario: '1234567',
      nombre: 'Juan',
      ap_paterno: 'Perez',
      ap_materno: 'Lopez',
      email: 'juan@test.com',
      direccion: 'Av. America',
      telefono: '70707070',
      id_rol: 1,
      otro_campo: 'ignorar',
    },
    {
      ci_usuario: '7654321',
      nombre: 'Maria',
      ap_paterno: 'Gomez',
      ap_materno: 'Rojas',
      email: 'maria@test.com',
      direccion: 'Calle Sucre',
      telefono: '78787878',
      id_rol: 2,
      otro_campo: 'ignorar',
    },
  ];

  beforeEach(async () => {
    usuariosServiceMock = {
      getUsuarios: jest.fn().mockResolvedValue([]),
    };

    await TestBed.configureTestingModule({
      imports: [AdminComponent],
      providers: [
        { provide: UsuariosService, useValue: usuariosServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar users como arreglo vacío', () => {
    expect(component.users).toEqual([]);
  });

  it('debería llamar a getUsuarios() en ngOnInit()', () => {
    const spy = jest.spyOn(component, 'getUsuarios').mockResolvedValue();

    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });

  it('debería llamar al servicio y mapear correctamente los usuarios', async () => {
    usuariosServiceMock.getUsuarios.mockResolvedValue(usuariosMock);

    await component.getUsuarios();

    expect(usuariosServiceMock.getUsuarios).toHaveBeenCalled();
    expect(component.users).toEqual([
      {
        ci_usuario: '1234567',
        nombre: 'Juan',
        ap_paterno: 'Perez',
        ap_materno: 'Lopez',
        email: 'juan@test.com',
        direccion: 'Av. America',
        telefono: '70707070',
        id_rol: 1,
      },
      {
        ci_usuario: '7654321',
        nombre: 'Maria',
        ap_paterno: 'Gomez',
        ap_materno: 'Rojas',
        email: 'maria@test.com',
        direccion: 'Calle Sucre',
        telefono: '78787878',
        id_rol: 2,
      },
    ]);
  });

  it('debería mostrar el mensaje cuando no hay usuarios registrados', async () => {
    usuariosServiceMock.getUsuarios.mockResolvedValue([]);

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compilado = fixture.nativeElement as HTMLElement;
    const mensaje = compilado.querySelector('p');

    expect(mensaje).toBeTruthy();
    expect(mensaje?.textContent?.trim()).toBe('No hay usuarios registrados.');
    expect(compilado.querySelector('table')).toBeNull();
  });

  it('debería renderizar la tabla cuando existen usuarios', async () => {
    usuariosServiceMock.getUsuarios.mockResolvedValue(usuariosMock);

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compilado = fixture.nativeElement as HTMLElement;
    const tabla = compilado.querySelector('table');

    expect(tabla).toBeTruthy();
  });

  it('debería renderizar los encabezados esperados en la tabla', async () => {
    usuariosServiceMock.getUsuarios.mockResolvedValue(usuariosMock);

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compilado = fixture.nativeElement as HTMLElement;
    const headers = Array.from(compilado.querySelectorAll('th')).map(th =>
      th.textContent?.trim()
    );

    expect(headers).toEqual([
      'CI',
      'Nombre completo',
      'Email',
      'Direccion',
      'Telefono',
    ]);
  });

  it('debería renderizar una fila por cada usuario', async () => {
    usuariosServiceMock.getUsuarios.mockResolvedValue(usuariosMock);

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compilado = fixture.nativeElement as HTMLElement;
    const filas = compilado.querySelectorAll('tbody tr');

    expect(filas.length).toBe(2);
  });

  it('debería mostrar correctamente el nombre completo concatenado', async () => {
    usuariosServiceMock.getUsuarios.mockResolvedValue(usuariosMock);

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compilado = fixture.nativeElement as HTMLElement;
    const primeraFila = compilado.querySelector('tbody tr');

    expect(primeraFila?.textContent).toContain('Juan Perez Lopez');
  });

  it('debería renderizar los datos principales del usuario en la tabla', async () => {
    usuariosServiceMock.getUsuarios.mockResolvedValue(usuariosMock);

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compilado = fixture.nativeElement as HTMLElement;
    const texto = compilado.textContent ?? '';

    expect(texto).toContain('1234567');
    expect(texto).toContain('Juan Perez Lopez');
    expect(texto).toContain('juan@test.com');
    expect(texto).toContain('Av. America');
    expect(texto).toContain('70707070');
  });

  it('debería ejecutar console.error() cuando el servicio falla', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    usuariosServiceMock.getUsuarios.mockRejectedValue(new Error('Fallo de servicio'));

    await component.getUsuarios();

    expect(errorSpy).toHaveBeenCalledWith(
      'Error al obtener usuarios:',
      'Fallo de servicio'
    );

    errorSpy.mockRestore();
  });
});