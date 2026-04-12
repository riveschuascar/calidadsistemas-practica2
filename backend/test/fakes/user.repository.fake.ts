class User {
  ci: number;
  nombre: string;
  email: string;
  password: string;
  rol?: any;
}

export class UserRepositoryFake {
  private usuarios: User[];

  constructor(initialData: User[] = []) {
    this.usuarios = [...initialData];
  }

  find = jest.fn(async () => {
    return this.usuarios;
  });

  findOne = jest.fn(async (options: any) => {
    if (!options || !options.where) return null;

    const keys = Object.keys(options.where);

    const usuario = this.usuarios.find(u =>
      keys.every(key => u[key] === options.where[key])
    );

    return usuario || null;
  });

  findOneBy = jest.fn(async (where: any) => {
    const keys = Object.keys(where);

    return (
      this.usuarios.find(u =>
        keys.every(key => u[key] === where[key])
      ) || null
    );
  });

  save = jest.fn(async (entity: User) => {
    const existingIndex = this.usuarios.findIndex(u => u.ci === entity.ci);

    if (existingIndex !== -1) {
      this.usuarios[existingIndex] = { ...this.usuarios[existingIndex], ...entity };
      return this.usuarios[existingIndex];
    }

    this.usuarios.push(entity);
    return entity;
  });

  update = jest.fn(async (id: number, partial: Partial<User>) => {
    const index = this.usuarios.findIndex(u => u.ci === id);

    if (index !== -1) {
      this.usuarios[index] = { ...this.usuarios[index], ...partial };
    }

    return { affected: index !== -1 ? 1 : 0 };
  });

  delete = jest.fn(async (id: number) => {
    const initialLength = this.usuarios.length;

    this.usuarios = this.usuarios.filter(u => u.ci !== id);

    return { affected: this.usuarios.length < initialLength ? 1 : 0 };
  });
}