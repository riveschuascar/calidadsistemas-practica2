import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nosotros.component.html',
  styleUrls: ['./nosotros.component.scss']
})
export class NosotrosComponent {
  platformName = 'Espacios Bolivia';
  purpose = 'Contribuir al desarrollo social y cultural de las comunidades, liderando la administración de espacios públicos.';
  values = [
    {
      icon: 'https://www.unesco.org/sites/default/files/styles/paragraph_medium_desktop/article/2024-09/Transparencia%20y%20Acceso.png.jpg?itok=QziKYJqY',
      title: 'Transparencia',
      description: 'Fomentamos procesos claros y accesibles para todos.',
    },
    {
      icon: 'https://images.shiksha.com/mediadata/images/articles/1707905364phpqiseG5.jpeg',
      title: 'Innovación',
      description: 'Apostamos por soluciones tecnológicas modernas y efectivas.',
    },
    {
      icon: 'https://media.istockphoto.com/id/1472932742/es/foto/grupo-de-personas-multigeneracionales-abraz%C3%A1ndose-entre-s%C3%AD-concepto-de-apoyo-multirracial-y.jpg?s=612x612&w=0&k=20&c=g73urZnTqtX9tUsgOZgM24WThD94Pd6ifCw8fjhGu3E=',
      title: 'Comunidad',
      description: 'Promovemos el acceso y la participación en espacios públicos.',
    }
  ];

  isModalOpen = false;
  selectedValue: { icon: string; title: string; description: string } | null = null;

  openModal(index: number): void {
    this.selectedValue = this.values[index];
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedValue = null;
  }
}
