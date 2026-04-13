import { UsuarioService } from "./usuario.service"
import { UserRepositoryFake } from "../../../test/fakes/user.repository.fake";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe('UsuarioService', () => {
  let service: UsuarioService;
  let repo: UserRepositoryFake;
  const createUsersData = () => ([
    { ci: 1, nombre: "Usuario 1", email: "usuario1@example.com", contrasena: "password1" },
    { ci: 2, nombre: "Usuario 2", email: "usuario2@example.com", contrasena: "password2" },
    { ci: 3, nombre: "Usuario 3", email: "usuario3@example.com", contrasena: "password3" }
  ]);

  beforeEach(() => {
    repo = new UserRepositoryFake(createUsersData());
    service = new UsuarioService(repo as any);
  });

  it('Should return a list of users', async () => {
    const result = await service.findAll();
    expect(result).toEqual(createUsersData());
  });

  it('Should return a user found by ID', async () => {
    const result = await service.findOne(2);
    expect(result).toEqual({ ci: 2, nombre: "Usuario 2", email: "usuario2@example.com", contrasena: "password2" });
  });

  it('Should return a user found by email', async () => {
    const result = await service.findByEmail("usuario2@example.com");
    expect(result).toEqual({ ci: 2, nombre: "Usuario 2", email: "usuario2@example.com", contrasena: "password2" });
  });

  it('Should raise an exception if user is not found by email', async () => {
    await expect(
      service.findByEmail("nonexistent@example.com")
    ).rejects.toThrow(NotFoundException);
  });

  it('Should create a new user', async () => {
    const result = await service.create({ ci: 4, nombre: "Usuario 4" });
    expect(result).toEqual({ ci: 4, nombre: "Usuario 4" });
  });

  it('Should create and hash the password of a new user', async () => {
    const result = await service.create({ ci: 4, nombre: "Usuario 4", contrasena: "plaintextpassword" });
    expect(result.contrasena).toContain("$2b$");
  });

  it('Should update an existing user', async () => {
    await service.update(2, { nombre: "Usuario 2 Updated" });
    const updatedUser = await service.findOne(2);
    expect(updatedUser).toEqual({ ci: 2, nombre: "Usuario 2 Updated", email: "usuario2@example.com", contrasena: "password2" });
  });

  it('Should update and hash the password of an existing user', async () => {
    await service.update(2, { contrasena: "newplaintextpassword" });
    const updatedUser = await service.findOne(2);
    expect(updatedUser.contrasena).toContain("$2b$");
  });

  // Tests for updatePartial()
  it('Should update only the provided fields of an existing user', async () => {
    const result = await service.updatePartial(2,
      {
        nombre: "Usuario 2 Partially Updated",
        rol: { _id: 1, rol: "admin" }
      });
    expect(result).toEqual(
      {
        ci: 2,
        nombre: "Usuario 2 Partially Updated",
        email: "usuario2@example.com",
        contrasena: "password2",
        rol: { _id: 1, rol: "admin" }
      });
  });

  it('Should hash the password when partially updating a user', async () => {
    const result = await service.updatePartial(2,
      {
        nombre: "Usuario 2 Partially Updated",
        contrasena: "anotherplaintextpassword",
        rol: { _id: 1, rol: "admin" }
      });
    expect(result.contrasena).toContain("$2b$");
  });

  it('Should validate if rol updated is not a number', async () => {
    await expect(
      service.updatePartial(2, { rol: { _id: "invalidRol", rol: "invalid" } } as any)
    ).rejects.toThrow(BadRequestException);
  });

  it('Should update the user if rol is not provided', async () => {
    const result = await service.updatePartial(2,
      {
        nombre: "Usuario 2 Partially Updated"
      });
    expect(result).toEqual(
      {
        ci: 2,
        nombre: "Usuario 2 Partially Updated",
        email: "usuario2@example.com",
        contrasena: "password2"
      });
  });

  it('Should raise an exception if user to update is not found', async () => {
    await expect(
      service.updatePartial(-1, { nombre: "Nonexistent User" })
    ).rejects.toThrow(NotFoundException);
  });
});