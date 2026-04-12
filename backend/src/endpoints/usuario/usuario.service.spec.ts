import { UsuarioService } from "./usuario.service"
import { UserRepositoryFake } from "../../../test/fakes/user.repository.fake";
import { NotFoundException } from "@nestjs/common";

describe('UsuarioService', () => {
  let service: UsuarioService;
  let repo: UserRepositoryFake;
  const usersData = [
    { ci: 1, nombre: "Usuario 1", email: "usuario1@example.com", password: "password1" },
    { ci: 2, nombre: "Usuario 2", email: "usuario2@example.com", password: "password2" },
    { ci: 3, nombre: "Usuario 3", email: "usuario3@example.com", password: "password3" }
  ];

  beforeEach(() => {
    repo = new UserRepositoryFake(usersData);
    service = new UsuarioService(repo as any);
  });

  it('Should return a list of users', async () => {
    const result = await service.findAll();
    expect(result).toEqual(usersData);
  });

  it('Should return a user found by ID', async () => {
    const result = await service.findOne(2);
    expect(result).toEqual({ ci: 2, nombre: "Usuario 2", email: "usuario2@example.com", password: "password2" });
  });

  it('Should return a user found by email', async () => {
    const result = await service.findByEmail("usuario2@example.com");
    expect(result).toEqual({ ci: 2, nombre: "Usuario 2", email: "usuario2@example.com", password: "password2" });
  });

  it('Should raise an exception if user is not found by email', async () => {
    await expect(
      service.findByEmail("nonexistent@example.com")
    ).rejects.toThrow(NotFoundException);
  });
  
});