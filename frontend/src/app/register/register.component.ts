import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerData = {
    ci: null,
    email: '',
    password: '',
    confirmPassword: '',
  };

  passwordError = '';
  emailError = '';
  ciUsuarioError = '';

  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly router: Router
  ) {}

  async onRegisterSubmit() {
    this.passwordError = '';
    this.emailError = '';
    this.ciUsuarioError = '';

    if (!this.registerData.ci || Number.isNaN(this.registerData.ci)) {
      this.ciUsuarioError = 'El CI de usuario es obligatorio y debe ser un número válido';
      return;
    }

    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.passwordError = 'Las contraseñas no coinciden';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.registerData.email)) {
      this.emailError = 'El formato del email es inválido';
      return;
    }

    try {
      const usuario = {
        ci: this.registerData.ci,
        email: this.registerData.email,
        contrasena: this.registerData.password,
      };

      const response = await this.usuariosService.createUsuario(usuario);
      console.log('Usuario registrado:', response);

      if (response?.ci) { // Asegúrate de que la respuesta tiene el campo esperado
        console.log('Usuario registrado:', response);
        localStorage.setItem('ci_usuario', response.ci.toString());
        this.router.navigate(['/registro-datos']);
      } else {
        console.error('Registro exitoso, pero respuesta inesperada:', response);
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
    }
  }
}
