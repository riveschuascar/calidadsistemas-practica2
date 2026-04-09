import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Reserva } from '../reserva/reserva.entity';
import { Usuario } from '../usuario/usuario.entity';
import { Estado } from '../estado/estado.entity';

@Entity('transferencias-reservas')
export class TransferenciaReserva {
    @PrimaryGeneratedColumn()
    _id: number;

    @OneToOne(() => Reserva)
    @JoinColumn({ name: 'reserva' })
    reseva: number;

    @ManyToOne(() => Usuario)
    @JoinColumn({ name: 'usuario_origen' })
    usuario_origen: number;

    @ManyToOne(() => Usuario)
    @JoinColumn({ name: 'usuario_destino' })
    usuario_destino: number;

    @Column({ type: 'date' })
    fecha: Date;

    @OneToOne(() => Estado)
    @JoinColumn({ name: 'estado' })
    estado: number;
}
