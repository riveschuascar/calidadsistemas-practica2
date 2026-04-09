import { Injectable, Injector } from '@angular/core';
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { AuthService } from './auth.service';
import { CustomAxiosRequestConfig } from './custom-axios-request-config';

@Injectable({
  providedIn: 'root',
})
export class AxiosService {
  private readonly axiosInstance: AxiosInstance;

  constructor(private readonly injector: Injector) {
    this.axiosInstance = axios.create({
      baseURL: 'http://localhost:3000',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig & CustomAxiosRequestConfig) => {
        const authService = this.injector.get(AuthService);

        // Verificar si se debe omitir el token
        if (!config.skipAuth) {
          const token = authService.getToken();
          if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}
