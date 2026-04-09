import { Injectable } from '@angular/core';
import { AxiosService } from './axios.service';

@Injectable({
  providedIn: 'root',
})
export class EspacioPublicoService {
  private readonly apiUrl = '/espacios-publicos';
  private espacios: any[] = []; // Almacén temporal de espacios
  private espacioSeleccionado: any = null; // Almacén temporal del espacio seleccionado

  constructor(private readonly axiosService: AxiosService) {}

  async getAll(): Promise<any[]> {
    if (this.espacios.length > 0) {
      return this.espacios;
    }
    try {
      const response = await this.axiosService.getAxiosInstance().get(this.apiUrl);
      this.espacios = response.data;
      return this.espacios;
    } catch (error: any) {
      console.error('Error al obtener los espacios públicos:', error.message);
      throw error;
    }
  }

  async getByType(tipo: string): Promise<any[]> {
    const allEspacios = await this.getAll();
    return allEspacios.filter((espacio) => espacio.tipo === tipo);
  }

  setEspacioSeleccionado(espacio: any): void {
    this.espacioSeleccionado = espacio;
  }

  getEspacioSeleccionado(): any {
    return this.espacioSeleccionado;
  }
}

