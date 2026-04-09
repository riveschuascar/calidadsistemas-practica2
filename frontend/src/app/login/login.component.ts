import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router'; // Importa Router para navegación
import { AuthService } from '../services/auth.service'; // Importa el AuthService

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink], // Manteniendo las importaciones originales
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginData = {
    email: '',
    password: '',
  };

  registerData = {
    email: '',
    password: '',
    confirmPassword: '',
  };

  isRegistering = false;
  errorMessage: string = '';

  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  async onSubmit(): Promise<void> {
    try {
      // Realiza el inicio de sesión
      const response = await this.authService.login(
        this.loginData.email,
        this.loginData.password
      );

      // Guarda el token en localStorage
      this.authService.saveToken(response.access_token);
      console.log('Inicio de sesion exitoso para el usuario:', this.loginData.email);
      console.log('Login exitoso.');
      this.router.navigate(['/home']);
    } catch (error) {
      // Maneja errores y muestra un mensaje de error
      this.errorMessage = 'Credenciales incorrectas. Por favor, inténtalo de nuevo.';
      console.error('Error al iniciar sesión:', error);
    }
  }

  async onRegisterSubmit(): Promise<void> {
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    try {
      console.log('Registro exitoso:', this.registerData);
      this.isRegistering = false;
    } catch (error) {
      this.errorMessage = 'Error al registrar usuario.';
      console.error('Error en el registro:', error);
    }
  }

  toggleRegister(): void {
    // Alterna entre los formularios de inicio de sesión y registro
    this.isRegistering = !this.isRegistering;
    this.errorMessage = ''; // Limpia mensajes de error previos
  }
}
