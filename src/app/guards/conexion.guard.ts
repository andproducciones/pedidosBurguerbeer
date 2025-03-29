import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Network } from '@capacitor/network';
import { GLOBAL } from '../services/GLOBAL';
import { AlertController } from '@ionic/angular'; // 👈 IMPORTANTE

@Injectable({
  providedIn: 'root'
})
export class ConexionGuard implements CanActivate {

  private urlServidor = GLOBAL.url;

  constructor(
    private router: Router,
    private alertController: AlertController // 👈 INYECTADO
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    localStorage.setItem('lastRoute', state.url);

    const status = await Network.getStatus();
    if (!status.connected) {
      await this.mostrarAlerta('Sin Internet', 'No tienes conexión a internet.');
      return this.router.parseUrl('/sin-conexion');
    }

    try {
      console.log('🌐 Verificando conexión con el servidor:', this.urlServidor);
    
      const response = await fetch(this.urlServidor, {
        method: 'GET',
        cache: 'no-cache'
      });
    
      console.log('📥 Respuesta del servidor:', response);
    
      if (!response.ok) {
        console.error('❌ Response no OK, status:', response.status);
        return this.router.parseUrl('/sin-conexion');
      }
    
      const data = await response.json();
      console.log('📦 Data recibida:', data);
    
      if (!data.estado) {
        console.error('⚠️ Estado falso:', data);
        return this.router.parseUrl('/sin-conexion');
      }
    
      console.log('✅ Conexión y respuesta correctas.');
      return true;
    
    } catch (error: any) {
      console.error('🔥 Error en fetch al servidor:', error.message || error);
      return this.router.parseUrl('/sin-conexion');
    }
    
    
  }

  private async mostrarAlerta(titulo: string, mensaje: any) {
    const contenido = typeof mensaje === 'object' ? JSON.stringify(mensaje, null, 2) : mensaje;
  
    const alert = await this.alertController.create({
      header: titulo,
      message: `${contenido}`,
      buttons: ['OK']
    });
    await alert.present();
  }
  
}
