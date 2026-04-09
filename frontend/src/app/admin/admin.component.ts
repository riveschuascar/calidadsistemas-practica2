import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  imports: [CommonModule],
})
export class AdminComponent implements OnInit {
  users: any[] = [];

  constructor(private readonly usuariosService: UsuariosService) {} // Inyecta UsuariosService

  ngOnInit() {
    this.getUsuarios();
  }

  async getUsuarios() {
    try {
      const usuarios = await this.usuariosService.getUsuarios();
      this.users = usuarios.map((user: any) => ({
        ci_usuario: user.ci_usuario,
        nombre: user.nombre,
        ap_paterno: user.ap_paterno,
        ap_materno: user.ap_materno,
        email: user.email,
        direccion: user.direccion,
        telefono: user.telefono,
        id_rol: user.id_rol,
      }));
    } catch (error: any) {
      console.error('Error al obtener usuarios:', error.response?.data || error.message);
    }
  }
}
