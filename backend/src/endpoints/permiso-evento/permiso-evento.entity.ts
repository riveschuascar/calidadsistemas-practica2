import { Entity, ManyToOne, JoinColumn, PrimaryColumn, Column } from 'typeorm';
import { Evento } from '../evento/evento.entity';
import { Permiso } from '../permiso/permiso.entity';
import { Estado } from '../estado/estado.entity';

@Entity('permisos-eventos')
export class PermisoEvento {
  @PrimaryColumn()
  evento: number;

  @PrimaryColumn()
  permiso: number;

  @ManyToOne(() => Evento)
  @JoinColumn({ name: 'evento' })
  evento_obj: Evento;

  @ManyToOne(() => Permiso)
  @JoinColumn({ name: 'permiso' })
  permiso_obj: Permiso;

  @Column({ type: 'blob', nullable: true })
  documento: Buffer;

  @ManyToOne(() => Estado)
  @JoinColumn({ name: 'estado' })
  estado: Estado;
}
