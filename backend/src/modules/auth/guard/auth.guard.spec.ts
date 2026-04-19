import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('canActivate', () => {
    let mockExecutionContext: ExecutionContext;
    let mockGetRequest: jest.Mock;

    beforeEach(() => {
      mockGetRequest = jest.fn();
      mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: mockGetRequest,
        }),
      } as any;
    });

    it('should return true if url is /auth/login', async () => {
      mockGetRequest.mockReturnValue({
        url: '/auth/login',
        headers: {},
      });

      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should throw UnauthorizedException if url is not /auth/login and no token is provided', async () => {
      mockGetRequest.mockReturnValue({
        url: '/some-other-url',
        headers: {},
      });

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(UnauthorizedException);
      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow('No se ha proporcionado el token');
    });

    it('should return true if url is not /auth/login and token is provided without errors', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      (jwtService.verifyAsync as jest.Mock).mockResolvedValue(mockUser);

      mockGetRequest.mockReturnValue({
        url: '/some-other-url',
        headers: { authorization: 'Bearer valid-token' },
      });

      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(mockGetRequest().user).toEqual(mockUser);
    });

    it('should throw UnauthorizedException with expired message if TokenExpiredError occurs', async () => {
      const error = new Error('Token expired');
      error.name = 'TokenExpiredError';
      (jwtService.verifyAsync as jest.Mock).mockRejectedValue(error);

      mockGetRequest.mockReturnValue({
        url: '/some-other-url',
        headers: { authorization: 'Bearer expired-token' },
      });

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(UnauthorizedException);
      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow('El token ha expirado');
    });

    it('should throw UnauthorizedException with invalid message if JsonWebTokenError occurs', async () => {
      const error = new Error('Invalid token');
      error.name = 'JsonWebTokenError';
      (jwtService.verifyAsync as jest.Mock).mockRejectedValue(error);

      mockGetRequest.mockReturnValue({
        url: '/some-other-url',
        headers: { authorization: 'Bearer invalid-token' },
      });

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(UnauthorizedException);
      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow('Token inválido');
    });

    it('should throw UnauthorizedException with generic message for other errors', async () => {
      const error = new Error('Some other error');
      (jwtService.verifyAsync as jest.Mock).mockRejectedValue(error);

      mockGetRequest.mockReturnValue({
        url: '/some-other-url',
        headers: { authorization: 'Bearer bad-token' },
      });

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(UnauthorizedException);
      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow('Error de autenticación');
    });
  });
});
