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
});
