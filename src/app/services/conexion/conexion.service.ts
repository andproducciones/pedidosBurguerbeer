import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';
import { Network } from '@capacitor/network';
import { GLOBAL } from '../GLOBAL';

@Injectable({
  providedIn: 'root'
})
export class ConexionService {
  private conectado$ = new BehaviorSubject<boolean>(false);
  private urlServidor = GLOBAL.url + 'index.php'; // Asegúrate de incluir endpoint válido

  constructor() {
    this.verificarRedInicial();
    this.suscribirseACambiosDeRed();
    this.verificarServidorPeriodicamente();
  }

  private async verificarRedInicial() {
    const status = await Network.getStatus();
    if (!status.connected) {
      this.conectado$.next(false);
      return;
    }
    await this.verificarServidor(); // ⚠️ Hacerlo solo si hay internet
  }

  private suscribirseACambiosDeRed() {
    Network.addListener('networkStatusChange', async (status) => {
      if (!status.connected) {
        this.conectado$.next(false);
        return;
      }
      await this.verificarServidor(); // verificar si hay servidor
    });
  }

  private verificarServidorPeriodicamente() {
    interval(60000).subscribe(() => {
      this.verificarServidor();
    });
  }

  private async verificarServidor() {
    try {
      const response = await fetch(this.urlServidor, {
        method: 'GET',
        cache: 'no-cache'
      });

      if (!response.ok) {
        this.conectado$.next(false);
        return;
      }

      const data = await response.json();
      if (data && data.estado === true) {
        this.conectado$.next(true);
      } else {
        this.conectado$.next(false);
      }

    } catch (error) {
      this.conectado$.next(false);
    }
  }

  getConexionObservable() {
    return this.conectado$.asObservable();
  }

  getConexionActual(): boolean {
    return this.conectado$.getValue();
  }

  async forzarVerificacionManual(): Promise<boolean> {
    await this.verificarServidor();
    return this.getConexionActual();
  }
}
