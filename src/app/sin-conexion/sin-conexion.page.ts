import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Network } from '@capacitor/network';
import { GLOBAL } from '../services/GLOBAL';

@Component({
  selector: 'app-sin-conexion',
  templateUrl: './sin-conexion.page.html',
  styleUrls: ['./sin-conexion.page.scss'],
  standalone: false
})
export class SinConexionPage {

  reintentando: boolean = false;

  constructor(private router: Router) {}

  ionViewWillEnter() {
    this.bloquearBotonAtras();
    this.iniciarReintentos();
  }

  ionViewWillLeave() {
    this.restablecerBotonAtras();
  }

  async iniciarReintentos() {
    if (this.reintentando) return;
    this.reintentando = true;

    const urlServidor = GLOBAL.url + 'index.php';
    const esperar = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    while (true) {
      const status = await Network.getStatus();

      if (status.connected) {
        try {
          const response = await fetch(urlServidor, { method: 'GET', cache: 'no-cache' });

          if (response.ok) {
            const data = await response.json();
            if (data.estado) {
              const lastRoute = localStorage.getItem('lastRoute') || '/pedidos';
              this.restablecerBotonAtras();
              this.router.navigate([lastRoute]);
              break;
            }
          }
        } catch (error) {
          // Silencioso
        }
      }

      await esperar(3000);
    }
  }

  async reintentarAhora() {
    this.iniciarReintentos();
  }

  bloquearBotonAtras() {
    document.addEventListener('backbutton', this.botonAtrasInhabilitado, false);
  }

  restablecerBotonAtras() {
    document.removeEventListener('backbutton', this.botonAtrasInhabilitado, false);
  }

  botonAtrasInhabilitado = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    // No hace nada al presionar el botón atrás
  };
}
