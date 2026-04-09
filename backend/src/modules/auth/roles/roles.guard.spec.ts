import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';  // Importamos Reflector
import { Test, TestingModule } from '@nestjs/testing';  // Importamos Test y TestingModule para crear el módulo de prueba

describe('RolesGuard', () => {
  let guard: RolesGuard;

  beforeEach(async () => {
    // Creamos el módulo de prueba
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,  // Proveemos el guard
        Reflector,   // Proveemos Reflector
      ],
    }).compile();

    // Obtenemos el guard instanciado desde el módulo de prueba
    guard = module.get<RolesGuard>(RolesGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
