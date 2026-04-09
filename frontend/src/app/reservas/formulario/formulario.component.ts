import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EspacioPublicoService } from '../../services/espacios-publicos.service';
import { ReservaService } from '../../services/reserva.service';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss'],
})
export class FormularioComponent implements OnInit {
  espacio: any;
  reserva = {
    nombre: '',
    ci: '',
    otb: '',
    tipoEvento: '',
    sector: '',
    fecha: '',
    tarjeta: '',
  };

  // Nueva propiedad para controlar la visibilidad del mensaje de solicitud
  mostrarMensaje: boolean = false;

constructor(private readonly espacioService: EspacioPublicoService, private readonly reservaService: ReservaService) {}

  ngOnInit(): void {
    this.espacio = this.espacioService.getEspacioSeleccionado();
    console.log(this.espacio.data);

    if (!this.espacio) {
      console.error('No hay espacio seleccionado.');
    }
  }

  ngSubmit() {
    this.reservar();
  }

  async reservar() {
    console.log('Datos de la reserva:', this.reserva);

    const reservaFinal = {
      usuario: Number(this.reserva.ci),
      espacio_publico: this.espacio._id,
      fecha: this.reserva.fecha,
      hora_inicio: '8:00:00',
      hora_fin: '18:00:00'
    };
    console.log(reservaFinal);

    try {
      // Aquí simularíamos que la reserva se realiza (si tienes una API, úsala)
      const response = await this.reservaService.postReserva(reservaFinal);
      console.log('Reserva realizada:', response);
      
      // Mostrar mensaje de solicitud enviada
      this.mostrarMensaje = true;

      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => {
        this.mostrarMensaje = false;
      }, 3000); // 3000 milisegundos = 3 segundos

    } catch (error: any) {
      console.log('No se pudo realizar la reserva');
      throw error;
    }
  }
}
