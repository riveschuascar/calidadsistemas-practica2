import { UsuarioService } from "./usuario.service"

describe('UsuarioService', () => {
  let service: UsuarioService;
  let repo: any;

  beforeEach(() => {
    repo = {
      find: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    service = new UsuarioService(repo);
  });

  it('Should return a list of users', async () => {
    const users = [{ id: 1 }, { id: 2 }, { id: 3 }];
    repo.find.mockResolvedValue(users);
    const result = await service.findAll();

    expect(result).toEqual(users);
  });
});