/// <reference types="jest" />
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermisoEventoService } from './permiso-evento.service';
import { PermisoEvento } from './permiso-evento.entity';

describe('PermisoEventoService', () => {
  let service: PermisoEventoService;
  let repository: jest.Mocked<Repository<PermisoEvento>>;

  const mockPermisoEventoRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermisoEventoService,
        {
          provide: getRepositoryToken(PermisoEvento),
          useValue: mockPermisoEventoRepository,
        },
      ],
    }).compile();

    service = module.get<PermisoEventoService>(PermisoEventoService);
    repository = module.get(getRepositoryToken(PermisoEvento));
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('debería llamar a repository.find con relaciones evento y permiso y retornar la lista', async () => {
      const resultado = [
        { evento: 1, permiso: 2 },
        { evento: 2, permiso: 3 },
      ] as PermisoEvento[];

      repository.find.mockResolvedValue(resultado);

      await expect(service.findAll()).resolves.toEqual(resultado);

      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({
        relations: ['evento', 'permiso'],
      });
    });
  });

  describe('findOne', () => {
    it('debería llamar a repository.findOne con evento y permiso y retornar el registro', async () => {
      const resultado = { evento: 1, permiso: 2 } as PermisoEvento;
      const evento = 1;
      const permiso = 2;

      repository.findOne.mockResolvedValue(resultado);

      await expect(service.findOne(evento, permiso)).resolves.toEqual(resultado);

      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { evento, permiso },
        relations: ['evento', 'permiso'],
      });
    });
  });

  describe('create', () => {
    it('debería llamar a repository.create y repository.save y retornar el registro guardado', async () => {
      const data: Partial<PermisoEvento> = {
        evento: 1,
        permiso: 2,
      };

      const entidadCreada = data as PermisoEvento;
      const entidadGuardada = {
        evento: 1,
        permiso: 2,
      } as PermisoEvento;

      repository.create.mockReturnValue(entidadCreada);
      repository.save.mockResolvedValue(entidadGuardada);

      await expect(service.create(data)).resolves.toEqual(entidadGuardada);

      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(repository.create).toHaveBeenCalledWith(data);
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(entidadCreada);
    });
  });

  describe('update', () => {
    it('debería llamar a repository.update con evento, permiso y data y resolver sin retorno', async () => {
      const evento = 1;
      const permiso = 2;
      const data: Partial<PermisoEvento> = {
        documento: Buffer.from('archivo'),
      };

      repository.update.mockResolvedValue({} as any);

      await expect(service.update(evento, permiso, data)).resolves.toBeUndefined();

      expect(repository.update).toHaveBeenCalledTimes(1);
      expect(repository.update).toHaveBeenCalledWith({ evento, permiso }, data);
    });
  });

  describe('delete', () => {
    it('debería llamar a repository.delete con evento y permiso y resolver sin retorno', async () => {
      const evento = 1;
      const permiso = 2;

      repository.delete.mockResolvedValue({} as any);

      await expect(service.delete(evento, permiso)).resolves.toBeUndefined();

      expect(repository.delete).toHaveBeenCalledTimes(1);
      expect(repository.delete).toHaveBeenCalledWith({ evento, permiso });
    });
  });
});