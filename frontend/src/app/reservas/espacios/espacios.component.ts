import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EspacioPublicoService } from '../../services/espacios-publicos.service';

@Component({
  selector: 'app-espacios',
  standalone: true,
  imports: [CommonModule, RouterLink],  // Agregar RouterModule
  templateUrl: './espacios.component.html',
  styleUrls: ['./espacios.component.scss']
})
export class EspaciosComponent implements OnInit {
  espacios: any[] = [];
  tipo: any ='';

constructor(private readonly espacioPublicoService: EspacioPublicoService, private readonly route: ActivatedRoute) {}
  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.tipo = params.get('tipo');
      console.log('tipo recibido:', this.tipo);

      this.espacioPublicoService.getByType(this.tipo)
        .then((data) => {
          this.espacios = data;
          console.log('Datos cargados correctamente', this.espacios);
        })
        .catch((error) => {
          console.error('Error al cargar los espacios publicos:', error);
        });
    });
  }

  selecEspacio(espacio: any) {
    this.espacioPublicoService.setEspacioSeleccionado(espacio);
  }
}