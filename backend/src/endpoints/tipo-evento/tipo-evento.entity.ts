import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tipos-eventos') // Entidad estatica
export class TipoEvento {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column({ length: 100 })
  tipo: string;
}
