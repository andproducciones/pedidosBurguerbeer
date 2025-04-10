import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ConexionService } from '../conexion/conexion.service';
import { EncryptionService } from '../encriptacion/encriptacion.service';


@Injectable()
export class ConexionInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private toastController: ToastController,
    private encryptionService: EncryptionService,
    private conexionService: ConexionService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // ❌ No excluimos /login ni /sin-conexion aquí, TODO pasará por este filtro
    const conectado = this.conexionService.getConexionActual();

    if (!conectado) {
      this.mostrarToast('Sin conexión al servidor o internet');
      this.router.navigate(['/sin-conexion']);
      return throwError(() => new Error('Sin conexión'));
    }

    // Validación de sesión para cualquier ruta (excepto login/recuperar)
    if (!req.url.includes('/login') && !req.url.includes('/recuperar-contrasena')) {
      const sesionCifrada = localStorage.getItem('userData');
      if (sesionCifrada) {
        const usuario = this.encryptionService.descifrarDatos(sesionCifrada);
        if (usuario?.fecha) {
          const fechaLogin = new Date(usuario.fecha);
          const ahora = new Date();
          const diffHoras = (ahora.getTime() - fechaLogin.getTime()) / (1000 * 60 * 60);
          if (diffHoras > 3) {
            localStorage.removeItem('userData');
            this.mostrarToast('Tu sesión ha expirado');
            this.router.navigate(['/login']);
            return throwError(() => new Error('Sesión expirada'));
          }
        } else {
          localStorage.removeItem('userData');
          this.mostrarToast('Sesión inválida');
          this.router.navigate(['/login']);
          return throwError(() => new Error('Sesión inválida'));
        }
      }
    }

    return next.handle(req).pipe(
      catchError(err => {
        this.mostrarToast('Error en la conexión');
        this.router.navigate(['/sin-conexion']);
        return throwError(() => err);
      })
    );
  }

  private async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'bottom',
      color: 'danger'
    });
    toast.present();
  }
}
