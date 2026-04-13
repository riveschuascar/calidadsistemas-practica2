import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { AuthGuard } from '../../modules/auth/guard/auth.guard';
import { RolesGuard } from '../../modules/auth/roles/roles.guard';

describe('UsuarioController', () => {
  let controller: UsuarioController;
  let service: UsuarioService;

  const UsuarioServiceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updatePartial: jest.fn(),
    delete: jest.fn(),
    migratePasswords: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioController],
      providers: [
        {
          provide: UsuarioService,
          useValue: UsuarioServiceMock,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UsuarioController>(UsuarioController);
    service = module.get<UsuarioService>(UsuarioService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of usuarios', async () => {
      const result = [{ id: 1, nombre: 'test' }];
      UsuarioServiceMock.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(UsuarioServiceMock.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a usuario', async () => {
      const result = { id: 1, nombre: 'test' };
      UsuarioServiceMock.findOne.mockResolvedValue(result);

      expect(await controller.findOne(1)).toBe(result);
      expect(UsuarioServiceMock.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a usuario with defaults', async () => {
      const input = { email: 'test@test.com' };
      const result = { id: 1, nombre: 'Usuario temporal', ap_paterno: 'Apellido temporal', ap_materno: 'Apellido temporal', direccion: 'Sin dirección', telefono: 'Sin teléfono', ...input };
      UsuarioServiceMock.create.mockResolvedValue(result);

      expect(await controller.create(input)).toBe(result);
      expect(UsuarioServiceMock.create).toHaveBeenCalledWith({
        ...input,
        nombre: 'Usuario temporal',
        ap_paterno: 'Apellido temporal',
        ap_materno: 'Apellido temporal',
        direccion: 'Sin dirección',
        telefono: 'Sin teléfono',
      });
    });

    it('should throw BadRequestException on duplicate entry', async () => {
      UsuarioServiceMock.create.mockRejectedValue({ code: 'ER_DUP_ENTRY' });

      await expect(controller.create({})).rejects.toThrow(BadRequestException);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      UsuarioServiceMock.create.mockRejectedValue(new Error('other'));

      await expect(controller.create({})).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('update', () => {
    it('should update a usuario', async () => {
      UsuarioServiceMock.update.mockResolvedValue(undefined);

      await controller.update(1, { nombre: 'new' });
      expect(UsuarioServiceMock.update).toHaveBeenCalledWith(1, { nombre: 'new' });
    });
  });

  describe('updatePartial', () => {
    it('should update partially', async () => {
      const result = { id: 1, nombre: 'updated' };
      UsuarioServiceMock.updatePartial.mockResolvedValue(result);

      expect(await controller.updatePartial(1, { nombre: 'updated' })).toBe(result);
      expect(UsuarioServiceMock.updatePartial).toHaveBeenCalledWith(1, { nombre: 'updated' });
    });

    it('should throw BadRequestException for invalid id', async () => {
      await expect(controller.updatePartial(NaN, {})).rejects.toThrow(BadRequestException);
    });

    it('should throw InternalServerErrorException on error', async () => {
      UsuarioServiceMock.updatePartial.mockRejectedValue(new Error('error'));

      await expect(controller.updatePartial(1, {})).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('delete', () => {
    it('should delete a usuario', async () => {
      UsuarioServiceMock.delete.mockResolvedValue(undefined);

      await controller.delete(1);
      expect(UsuarioServiceMock.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('migratePasswords', () => {
    it('should call migratePasswords', async () => {
      UsuarioServiceMock.migratePasswords.mockResolvedValue(undefined);

      expect(await controller.migratePasswords()).toBe('Migración de contraseñas completada.');
      expect(UsuarioServiceMock.migratePasswords).toHaveBeenCalled();
    });
  });
});
