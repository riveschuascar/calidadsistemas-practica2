import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  describe('canActivate', () => {
    let mockExecutionContext: ExecutionContext;
    let mockGetRequest: jest.Mock;

    beforeEach(() => {
      mockGetRequest = jest.fn();
      mockExecutionContext = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: mockGetRequest,
        }),
      } as any;
    });

    it('should return true if no roles are defined', () => {
      (reflector.get as jest.Mock).mockReturnValue(undefined);

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should throw ForbiddenException if roles exist but user is not present', () => {
      (reflector.get as jest.Mock).mockReturnValue([1, 2]);
      mockGetRequest.mockReturnValue({});

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(mockExecutionContext)).toThrow('Usuario no autenticado o rol inválido');
    });

    it('should throw ForbiddenException if roles exist, user exists, but id_rol is not a number', () => {
      (reflector.get as jest.Mock).mockReturnValue([1, 2]);
      mockGetRequest.mockReturnValue({ user: { id_rol: 'not-a-number' } });

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(mockExecutionContext)).toThrow('Usuario no autenticado o rol inválido');
    });

    it('should throw ForbiddenException if roles exist, user exists, id_rol is a number, but id_rol is not included in roles', () => {
      (reflector.get as jest.Mock).mockReturnValue([1, 2]);
      mockGetRequest.mockReturnValue({ user: { id_rol: 3 } });

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(mockExecutionContext)).toThrow('No tienes permiso para acceder a este recurso');
    });

    it('should return true if roles exist, user exists, id_rol is a number, and id_rol is included in roles', () => {
      (reflector.get as jest.Mock).mockReturnValue([1, 2]);
      mockGetRequest.mockReturnValue({ user: { id_rol: 1 } });

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });
  });
});
