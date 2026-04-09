import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-registro-datos',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registro-datos.component.html',
  styleUrls: ['./registro-datos.component.scss'],
})
export class RegistroDatosComponent {
  registroDatosData = {
    nombre: '',
    ap_paterno: '',
    ap_materno: '',
    direccion: '',
    telefono: '',
  };

  errorMessage = '';

  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly router: Router
  ) {}

  async onRegistroDatosSubmit() {
    try {
      // Recuperar el CI del usuario desde localStorage
      const ciUsuario = localStorage.getItem('ci_usuario');
      if (!ciUsuario) {
        this.errorMessage = 'No se encontró el CI del usuario. Por favor, regístrese de nuevo.';
        console.error('CI del usuario no encontrado en localStorage');
        return;
      }

      // Realizar la actualización de datos del usuario
      const response = await this.usuariosService.updateUsuarioDatos(
        Number.parseInt(ciUsuario, 10),
        this.registroDatosData
      );

      console.log('Datos actualizados:', response);

      localStorage.removeItem('ci_usuario');

      this.router.navigate(['/home']);
    } catch (error: any) {
      this.errorMessage = 'Ocurrió un error al actualizar los datos del usuario.';
      console.error('Error al actualizar datos:', error.message || error);
    }
  }
}
