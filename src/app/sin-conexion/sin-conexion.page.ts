import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConexionService } from '../services/conexion/conexion.service';

@Component({
  selector: 'app-sin-conexion',
  templateUrl: './sin-conexion.page.html',
  styleUrls: ['./sin-conexion.page.scss'],
  standalone: false
})
export class SinConexionPage {

  reintentando: boolean = false;
  detenerReintento: boolean = false;

  constructor(
    private router: Router,
    private conexionService: ConexionService
  ) {}

  ionViewWillEnter() {
    this.bloquearBotonAtras();
    this.iniciarReintentos();
  }

  ionViewWillLeave() {
    this.restablecerBotonAtras();
    this.detenerReintento = true;
  }

  async iniciarReintentos() {
    if (this.reintentando) return;
    this.reintentando = true;

    const esperar = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    while (!this.detenerReintento) {
      const conectado = await this.conexionService.forzarVerificacionManual();

      if (conectado) {
        let lastRoute = localStorage.getItem('lastRoute') || '/pedidos';

        if (lastRoute === '/sin-conexion') {
          lastRoute = '/pedidos';
        }

        this.detenerReintento = true;
        this.router.navigateByUrl(lastRoute);
        return;
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
  };
}
