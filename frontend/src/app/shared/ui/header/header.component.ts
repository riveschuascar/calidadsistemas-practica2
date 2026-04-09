import { Component, OnInit } from '@angular/core';
import { RouterLink, Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthStateService } from '../../../services/auth-state.service';
import { AuthService } from '../../../services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styles: ``
})
export class HeaderComponent implements OnInit {
  isAuthenticated: boolean = false;
  userRole: number | null = null; // Declarar `userRole` aquí
  
  constructor(
    private readonly authStateService: AuthStateService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.authStateService.authStatus$.subscribe((status) => {
      this.isAuthenticated = status;

      // Si está autenticado, decodificar el token para obtener el rol
      if (status) {
        const token = localStorage.getItem('access_token');
        if (token) {
          const decodedToken: any = jwtDecode(token);
          this.userRole = decodedToken.id_rol || null; // Almacena el rol del usuario
        }
      } else {
        this.userRole = null; // Si no está autenticado, resetea el rol
      }
    });
  }
  logout(): void {
    this.authService.logout();
    this.authStateService.setAuthStatus(false);
    this.router.navigate(['/login']);
    console.log('Sesión cerrada exitosamente');
  }
}
