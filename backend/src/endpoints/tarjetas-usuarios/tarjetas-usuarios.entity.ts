import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';

@Entity('tarjetas-usuarios')
export class TarjetasUsuarios {
    @PrimaryColumn()
    usuario: number;

    @PrimaryColumn({ length: 19 })
    numero_tarjeta: string;

    @ManyToOne(() => Usuario)
    @JoinColumn({ name: 'usuario' })
    usuario_obj: Usuario;

    @Column('decimal', { precision: 9, scale: 6 })
    saldo: number;

    @Column({ type: 'date' })
    caducidad: string

    @Column({ length: 4 })
    cvc: string
}