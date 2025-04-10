import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ConexionService } from '../services/conexion/conexion.service';

@Injectable({
  providedIn: 'root'
})
export class ConexionGuard implements CanActivate {

  constructor(
    private conexionService: ConexionService,
    private router: Router,
    private alertController: AlertController
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    localStorage.setItem('lastRoute', state.url);

    // 🧠 Verifica la conexión REAL al momento de la navegación
    const conectado = await this.conexionService.forzarVerificacionManual();

    if (!conectado) {
      await this.mostrarAlerta('Sin conexión', 'No se puede acceder a esta ruta sin conexión al servidor.');
      return this.router.parseUrl('/sin-conexion');
    }

    return true;
  }

  private async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
}
