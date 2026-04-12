class User {
  ci: number;
  nombre: string;
  email: string;
  password: string;
}

export class UserRepositoryFake{
  private usuarios: User[];

  constructor(initialData: User[] = []) {
    this.usuarios = [...initialData];
  }

  find = jest.fn(async () => {
    return this.usuarios;
  });

  findOne = jest.fn(async ({ where }: any) => {
    return this.usuarios.find(usuario => usuario.ci === where.ci) || null;
  });

  findOneBy = jest.fn(async (where: any) => {
    return this.usuarios.find(usuario => usuario.ci === where.ci) || null;
  });

  save = jest.fn(async (entity: User) => {
    this.usuarios.push(entity);
    return entity;
  });

  update = jest.fn(async (id: number, partial: Partial<User>) => {
    const index = this.usuarios.findIndex(usuario => usuario.ci === id);
    if (index !== -1) {
      this.usuarios[index] = { ...this.usuarios[index], ...partial };
    }
    return { affected: index !== -1 ? 1 : 0 };
  });

  delete = jest.fn(async (id: number) => {
    const initialLength = this.usuarios.length;
    this.usuarios = this.usuarios.filter(usuario => usuario.ci !== id);

    return { affected: this.usuarios.length < initialLength ? 1 : 0 };
  });
}