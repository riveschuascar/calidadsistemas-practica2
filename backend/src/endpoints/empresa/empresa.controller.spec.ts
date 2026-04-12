import { Test, TestingModule } from '@nestjs/testing';
import { EmpresaController } from './empresa.controller';
import { EmpresaService } from './empresa.service';
import { UsuarioService } from '../usuario/usuario.service';

describe('EmpresaController', () => {
  let controller: EmpresaController;

  const mockEmpresaService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const mockUsuarioService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmpresaController],
      providers: [
        {
          provide: EmpresaService,
          useValue: mockEmpresaService,
        },
        {
          provide: UsuarioService,
          useValue: mockUsuarioService,
        },
      ],
    }).compile();

    controller = module.get<EmpresaController>(EmpresaController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería retornar todas las empresas', async () => {
    const resultado = [{ id: 1 }];
    mockEmpresaService.findAll.mockResolvedValue(resultado);

    const res = await controller.findAll();

    expect(res).toEqual(resultado);
    expect(mockEmpresaService.findAll).toHaveBeenCalled();
  });

  it('debería retornar una empresa por id', async () => {
    const empresa = { id: 1 };
    mockEmpresaService.findOne.mockResolvedValue(empresa);

    const res = await controller.findOne(1);

    expect(res).toEqual(empresa);
    expect(mockEmpresaService.findOne).toHaveBeenCalledWith(1);
  });

  it('debería crear una empresa si el usuario existe', async () => {
    const body = {
      ci_usuario: 123,
      empresa: 'Empresa Test',
      documento: Buffer.from('test'),
    };

    const usuarioMock = { id: 1 };
    const empresaCreada = { id: 1, ...body };

    mockUsuarioService.findOne.mockResolvedValue(usuarioMock);
    mockEmpresaService.create.mockResolvedValue(empresaCreada);

    const res = await controller.create(body);

    expect(res).toEqual(empresaCreada);
    expect(mockUsuarioService.findOne).toHaveBeenCalledWith(123);
    expect(mockEmpresaService.create).toHaveBeenCalledWith({
      usuario: usuarioMock,
      empresa: body.empresa,
      documento: body.documento,
    });
  });

  it('debería lanzar error si el usuario no existe', async () => {
    const body = {
      ci_usuario: 123,
      empresa: 'Empresa Test',
      documento: Buffer.from('test'),
    };

    mockUsuarioService.findOne.mockResolvedValue(null);

    await expect(controller.create(body)).rejects.toThrow(
      'Usuario no encontrado',
    );

    expect(mockUsuarioService.findOne).toHaveBeenCalledWith(123);
  });
});