import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should throw Error with "Credenciales inválidas" if user validation fails', async () => {
      const loginDto = { email: 'test@example.com', contrasena: 'password' };

      (authService.validateUser as jest.Mock).mockRejectedValue(new Error('Credenciales inválidas'));

      await expect(controller.login(loginDto)).rejects.toThrow(Error);
      await expect(controller.login(loginDto)).rejects.toThrow('Credenciales inválidas');
    });

    it('should return token from AuthService.login if user validation succeeds', async () => {
      const loginDto = { email: 'test@example.com', contrasena: 'password' };
      const mockUser = { id: 1, email: 'test@example.com', rol: { _id: 1, rol: 'admin' } };
      const mockTokenResponse = { access_token: 'mocked-jwt-token' };

      (authService.validateUser as jest.Mock).mockResolvedValue(mockUser);
      (authService.login as jest.Mock).mockReturnValue(mockTokenResponse);

      const result = await controller.login(loginDto);

      expect(authService.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.contrasena);
      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockTokenResponse);
    });
  });
});
