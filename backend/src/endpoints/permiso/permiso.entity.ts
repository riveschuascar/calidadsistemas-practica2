import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('permisos') // Entidad Estatica
export class Permiso {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column({ length: 50 })
  nombre: string;
}
