import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('espacios-publicos') // Entidad estatica
@Index('idxespacios_nombre', ['nombre'])
@Index('idxespacios_tipo', ['tipo'])
export class EspacioPublico {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column('decimal', { precision: 9, scale: 6 })
  altitud: number;

  @Column('decimal', { precision: 9, scale: 6 })
  latitud: number;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ length: 255 })
  url_imagen: string;

  @Column({ length: 10 })
  tipo: string;
}
