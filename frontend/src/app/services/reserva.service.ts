import { AxiosService } from "./axios.service";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
  })
export class ReservaService {
    private readonly baseUrl = '/reservas';

    constructor(private readonly axiosService: AxiosService) {}

    async postReserva(body:{ usuario: number, espacio_publico: number, fecha: string, hora_inicio: string, hora_fin: string}) {
        try {
            const reserva = await this.axiosService.getAxiosInstance().post(this.baseUrl, body);
            return reserva.data;
        } catch (error: any) {
            console.log('Error al guardar informacion de la reserva');
            throw error;
        }
    }
}