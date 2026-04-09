import { Injectable } from '@angular/core';
import { AxiosService } from './axios.service';
import { AxiosResponse } from 'axios';
import { AuthStateService } from './auth-state.service';

interface AuthResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = '/auth';

  constructor(
    private readonly axiosService: AxiosService,
    private readonly authStateService: AuthStateService
  ) {}

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.axiosService
        .getAxiosInstance()
        .post(`${this.apiUrl}/login`, {
          email,
          contrasena: password,
        });

      const token = response.data.access_token;
      this.saveToken(token);
      this.authStateService.setAuthStatus(true);
      return response.data;
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error.response?.data || error.message);
      throw error;
    }
  }

  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.authStateService.setAuthStatus(false);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
