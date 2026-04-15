/// <reference types="jest" />
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PresidenteOtbService } from './presidente_otb.service';
import { PresidenteOtb } from './presidente_otb.entity';
import { Usuario } from '../usuario/usuario.entity';

describe('PresidenteOtbService', () => {
  let service: PresidenteOtbService;
  let presidenteOtbRepository: jest.Mocked<Repository<PresidenteOtb>>;
  let usuarioRepository: jest.Mocked<Repository<Usuario>>;

  const mockPresidenteOtbRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockUsuarioRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PresidenteOtbService,
        {
          provide: getRepositoryToken(PresidenteOtb),
          useValue: mockPresidenteOtbRepository,
        },
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockUsuarioRepository,
        },
      ],
    }).compile();

    service = module.get<PresidenteOtbService>(PresidenteOtbService);
    presidenteOtbRepository = module.get(getRepositoryToken(PresidenteOtb));
    usuarioRepository = module.get(getRepositoryToken(Usuario));

    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('debería llamar a presidenteOtbRepository.find con relación usuario y retornar la lista de presidentes-otb', async () => {
      const resultado = [
        { _id: 1, otb: 'OTB Central' },
        { _id: 2, otb: 'OTB Norte' },
      ] as PresidenteOtb[];

      presidenteOtbRepository.find.mockResolvedValue(resultado);

      await expect(service.findAll()).resolves.toEqual(resultado);

      expect(presidenteOtbRepository.find).toHaveBeenCalledTimes(1);
      expect(presidenteOtbRepository.find).toHaveBeenCalledWith({
        relations: ['usuario'],
      });
    });
  });

  describe('findOne', () => {
    it('debería llamar a presidenteOtbRepository.findOne con where: { _id: id } y retornar un presidente-otb', async () => {
      const id = 1;
      const resultado = { _id: 1, otb: 'OTB Central' } as PresidenteOtb;

      presidenteOtbRepository.findOne.mockResolvedValue(resultado);

      await expect(service.findOne(id)).resolves.toEqual(resultado);

      expect(presidenteOtbRepository.findOne).toHaveBeenCalledTimes(1);
      expect(presidenteOtbRepository.findOne).toHaveBeenCalledWith({
        where: { _id: id },
        relations: ['usuario'],
      });
    });
  });

  describe('findUsuarioByCi', () => {
    it('debería llamar a usuarioRepository.findOne con where: { ci: ci_usuario } y retornar un usuario', async () => {
      const ci_usuario = 123456;
      const usuario = { ci: ci_usuario } as any;

      usuarioRepository.findOne.mockResolvedValue(usuario);

      await expect(service.findUsuarioByCi(ci_usuario)).resolves.toEqual(usuario);

      expect(usuarioRepository.findOne).toHaveBeenCalledTimes(1);
      expect(usuarioRepository.findOne).toHaveBeenCalledWith({
        where: { ci: ci_usuario },
      });
    });
  });

  describe('create', () => {
    it('debería llamar a presidenteOtbRepository.create, luego a presidenteOtbRepository.save y retornar el presidente-otb guardado', async () => {
      const usuarioMock = { ci: 123456 } as any;

      const data: Partial<PresidenteOtb> = {
        usuario: usuarioMock,
        otb: 'OTB Central',
        documento: Buffer.from('archivo'),
      };

      const nuevoPresidenteOtb = data as PresidenteOtb;
      const presidenteGuardado = {
        _id: 1,
        ...data,
      } as PresidenteOtb;

      presidenteOtbRepository.create.mockReturnValue(nuevoPresidenteOtb);
      presidenteOtbRepository.save.mockResolvedValue(presidenteGuardado);

      await expect(service.create(data)).resolves.toEqual(presidenteGuardado);

      expect(presidenteOtbRepository.create).toHaveBeenCalledTimes(1);
      expect(presidenteOtbRepository.create).toHaveBeenCalledWith({
        usuario: data.usuario,
        otb: data.otb,
        documento: data.documento,
      });

      expect(presidenteOtbRepository.save).toHaveBeenCalledTimes(1);
      expect(presidenteOtbRepository.save).toHaveBeenCalledWith(nuevoPresidenteOtb);
    });
  });

  describe('delete', () => {
    it('debería llamar a presidenteOtbRepository.delete con id y ejecutar correctamente la eliminación sin errores', async () => {
      const id = 1;

      presidenteOtbRepository.delete.mockResolvedValue({} as any);

      await expect(service.delete(id)).resolves.toBeUndefined();

      expect(presidenteOtbRepository.delete).toHaveBeenCalledTimes(1);
      expect(presidenteOtbRepository.delete).toHaveBeenCalledWith(id);
    });
  });
});