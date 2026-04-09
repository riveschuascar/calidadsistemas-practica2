import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EspacioPublicoService } from './../services/espacios-publicos.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly espacioServicio: EspacioPublicoService) {
  }

  highlights = [
    {
      title: 'Reserva Espacios',
      description: 'Gestiona y reserva espacios públicos con facilidad.',
      icon: 'https://cdn-icons-png.flaticon.com/512/3094/3094838.png',
    },
    {
      title: 'Innovación Digital',
      description: 'Tecnología de punta para simplificar procesos.',
      icon: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png',
    },
    {
      title: 'Acceso Inclusivo',
      description: 'Diseñado para fomentar la participación de toda la comunidad.',
      icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    },
  ];

  galleryImages = [
    'https://abi.bo/images/Noticias/Economia/sep-22/DINOSAURIOS.jpg',
    'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh5kaj4Kxc3gLaRPFsivHGPsZLa2GjoQeWMtPzff0JzMC7Ix7hOcDsmLC58mU6EwHr0s8_-QkSqRfGi99b_Y5BYf82YSBaUMTrOkuMafxRLP4VrnoAWtXbq0J_eVS-aoCaz93TTNsujmc1G/s1600/x3icld.jpg',
    'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/55/c1/8b/laguna-macho-en-la-base.jpg?w=1200&h=700&s=1',
    'https://cdn.pixabay.com/photo/2017/01/28/14/56/mountain-2019473_960_720.jpg',
    'https://cdn.pixabay.com/photo/2016/11/14/03/16/beach-1824855_960_720.jpg',
  ];

  carousel: any[] = [];

  currentIndex = 0; // Índice inicial del carrusel
  visibleItems = 2; // Número de imágenes visibles al mismo tiempo
  interval: any;


  ngOnInit(): void {
    this.espacioServicio
      .getAll()
      .then((data) => {
        this.carousel = data;
        console.log('Datos cargados correctamente', this.carousel);
        this.startAutoSlide();
      })
      .catch((error) => {
        console.error('Error al cargar los espacios publicos:', error);
      });
  }

  scrollTo(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  nextSlide(): void {
    // Avanzar al siguiente conjunto de imágenes
    this.currentIndex = (this.currentIndex + 1) % (this.galleryImages.length - this.visibleItems + 1);
  }

  prevSlide(): void {
    // Retroceder al conjunto anterior de imágenes
    this.currentIndex =
      (this.currentIndex - 1 + (this.galleryImages.length - this.visibleItems + 1)) %
      (this.galleryImages.length - this.visibleItems + 1);
  }

  startAutoSlide(): void {
    this.interval = setInterval(() => {
      this.nextSlide();
    }, 3000); // Cambia cada 3 segundos
  }

  stopAutoSlide(): void {
    clearInterval(this.interval);
  }
}
