import { Injectable } from '@angular/core';
import { AxiosService } from './axios.service';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private readonly apiUrl = '/usuarios';

  constructor(private readonly axiosService: AxiosService) {}

  async getUsuarios() {
    try {
      const response = await this.axiosService.getAxiosInstance().get(this.apiUrl);
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener usuarios:', error.response?.data || error.message);
      throw error;
    }
  }

  async createUsuario(data: { ci: number; email: string; contrasena: string }) {
    try {
      const response = await this.axiosService.getAxiosInstance().post(this.apiUrl, data, {
        skipAuth: true,
      } as any);
      return response.data;
    } catch (error: any) {
      console.error('Error al crear usuario:', error.response?.data || error.message);
      throw error;
    }
  }

  async updateUsuarioDatos(ci: number, data: any) {
    try {
      const response = await this.axiosService.getAxiosInstance().patch(
        `${this.apiUrl}/${ci}`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('Error al actualizar datos del usuario:', error.response?.data || error.message);
      throw error;
    }
  }
}
