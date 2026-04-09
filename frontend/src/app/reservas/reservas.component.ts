import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EspacioPublicoService } from '../services/espacios-publicos.service';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.scss'],
})
export class ReservasComponent implements OnInit {
  tipo: string = ''; // Parámetro de tipo
  espacios: any[] = []; // Espacios filtrados

 constructor(
  private readonly route: ActivatedRoute,
  private readonly router: Router,
  private readonly espacioService: EspacioPublicoService
) {}

  ngOnInit(): void {
    // Escucha cambios en la ruta para obtener el parámetro 'tipo'
    this.route.paramMap.subscribe(async (params) => {
      this.tipo = params.get('tipo') || '';
      if (this.tipo) {
        await this.cargarEspaciosPorTipo(this.tipo);
      }
    });
  }

  async cargarEspaciosPorTipo(tipo: string): Promise<void> {
    try {
      this.espacios = await this.espacioService.getByType(tipo);
    } catch (error) {
      console.error('Error al cargar espacios por tipo:', error);
    }
  }

  seleccionarEspacio(espacio: any) {
    this.espacioService.setEspacioSeleccionado(espacio);
    this.router.navigate(['/formulario']);
  }

  navigateToSpaces(tipo: string): void {
    this.router.navigate([`/reservas/${tipo}`]);
  }
}
