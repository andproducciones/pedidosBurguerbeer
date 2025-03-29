import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { LoginService } from '../services/login/login.service';
import { EncryptionService } from '../services/encriptacion/encriptacion.service';
import { timeout } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  cedula: string = '';
  password: string = '';
  intentosFallidos: number = 0;
  bloqueado: boolean = false;
  tiempoRestante: number = 60;
  interval: any;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private alertController: AlertController,
    private encryptionService: EncryptionService,
    private loadingController: LoadingController
  ) {}

  async ionViewWillEnter() {
    const storedUserData = localStorage.getItem('userData');

    if (storedUserData) {
      const userData = this.encryptionService.descifrarDatos(storedUserData);

      if (userData) {
        const lastRoute = localStorage.getItem('lastRoute') || '/pedidos';
        this.router.navigate([lastRoute]);
        localStorage.removeItem('lastRoute'); // Limpia la ruta guardada
      } else {
        localStorage.removeItem('userData'); // Datos corruptos
      }
    }
  }

  async login() {
    if (this.bloqueado) {
      this.showAlert('Cuenta Bloqueada', `Inténtalo de nuevo en ${this.tiempoRestante} segundos.`);
      return;
    }

    if (!this.cedula || !this.password) {
      this.showAlert('Error', 'Ingrese su cédula y contraseña.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Verificando credenciales...',
      spinner: 'crescent',
      backdropDismiss: false
    });
    await loading.present();

    this.loginService.login(this.cedula, this.password).pipe(
      timeout(10000)
    ).subscribe(
      async response => {
        await loading.dismiss();

        if (response.respuesta.estado === true) {
          const datosCifrados = this.encryptionService.cifrarDatos(response.data);
          localStorage.setItem('userData', datosCifrados);
          this.intentosFallidos = 0;

          const lastRoute = localStorage.getItem('lastRoute') || '/pedidos';
          this.router.navigate([lastRoute]);
          localStorage.removeItem('lastRoute');

        } else {
          this.intentosFallidos++;
          this.showAlert('Error', 'Credenciales incorrectas.');
          if (this.intentosFallidos >= 3) {
            this.bloquearUsuario();
          }
        }
      },
      async error => {
        await loading.dismiss();
        console.error('Error detectado:', error);

        if (error.status === 0) {
          this.showAlert('Error', 'No se pudo conectar con el servidor. Por favor, verifica tu conexión.');
        } else if (error.status >= 400 && error.status < 500) {
          this.showAlert('Error', `Error del cliente: ${error.statusText || 'Solicitud incorrecta.'}`);
        } else if (error.status >= 500) {
          this.showAlert('Error', 'Error en el servidor. Por favor, intenta más tarde.');
        } else if (error.name === 'TimeoutError') {
          this.showAlert('Error', 'La solicitud al servidor ha tardado demasiado.');
        } else {
          this.showAlert('Error', `Error desconocido: ${JSON.stringify(error)}`);
        }
      }
    );
  }

  bloquearUsuario() {
    this.bloqueado = true;
    this.tiempoRestante = 60;

    this.showAlert('Cuenta Bloqueada', 'Has fallado 3 intentos. Espera 1 minuto para intentarlo nuevamente.');

    this.interval = setInterval(() => {
      this.tiempoRestante--;
      if (this.tiempoRestante <= 0) {
        clearInterval(this.interval);
        this.bloqueado = false;
        this.intentosFallidos = 0;
      }
    }, 1000);
  }

  crearCuenta() {
    this.router.navigate(['/crear-cuenta']);
  }

  recuperarPassword() {
    this.router.navigate(['/recuperar-contrasena']);
  }

  async showAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
