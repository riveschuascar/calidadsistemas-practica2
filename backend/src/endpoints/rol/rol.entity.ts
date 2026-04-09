import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('roles') // Entidad estatica
export class Rol {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column({ length: 15 })
  rol: string;
}