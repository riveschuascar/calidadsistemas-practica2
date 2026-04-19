import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsuarioService } from '../../endpoints/usuario/usuario.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usuarioService: UsuarioService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsuarioService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usuarioService = module.get<UsuarioService>(UsuarioService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should throw UnauthorizedException if user is not found by email', async () => {
      (usuarioService.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(service.validateUser('nonexistent@email.com', 'password')).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.validateUser('nonexistent@email.com', 'password')).rejects.toThrow(
        'Credenciales inválidas',
      );
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const mockUser = {
        id: 1,
        email: 'test@email.com',
        contrasena: 'hashed-password',
        nombre: 'Test User',
        rol: { _id: 1, rol: 'admin' },
      };

      (usuarioService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.validateUser('test@email.com', 'wrong-password')).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.validateUser('test@email.com', 'wrong-password')).rejects.toThrow(
        'Credenciales inválidas',
      );
    });

    it('should return user data without password if email and password match', async () => {
      const mockUser = {
        id: 1,
        email: 'test@email.com',
        contrasena: 'hashed-password',
        nombre: 'Test User',
        rol: { _id: 1, rol: 'admin' },
      };

      (usuarioService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@email.com', 'correct-password');

      expect(result).toEqual({
        id: 1,
        email: 'test@email.com',
        nombre: 'Test User',
        rol: { _id: 1, rol: 'admin' },
      });
      expect(result).not.toHaveProperty('contrasena');
    });
  });

  describe('login', () => {
    it('should generate a token with correct payload structure', async () => {
      const mockUser = {
        id: 3,
        email: 'admin@email.com',
        nombre: 'Admin User',
        rol: {
          _id: 1,
          rol: 'admin',
        },
      };

      const mockToken = 'admin-jwt-token';
      (jwtService.sign as jest.Mock).mockReturnValue(mockToken);

      const result = await service.login(mockUser);

      const callArgs = (jwtService.sign as jest.Mock).mock.calls[0][0];
      expect(callArgs).toHaveProperty('email');
      expect(callArgs).toHaveProperty('id_rol');
      expect(callArgs).toHaveProperty('rol');
      expect(callArgs.email).toBe('admin@email.com');
      expect(callArgs.id_rol).toBe(1);
      expect(callArgs.rol).toBe('admin');
    });
  });
});
