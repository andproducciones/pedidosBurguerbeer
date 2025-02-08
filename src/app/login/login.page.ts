import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { LoginService } from '../services/login/login.service';
import { EncryptionService } from '../services/encriptacion/encriptacion.service';

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
  tiempoRestante: number = 60; // 1 minuto en segundos
  interval: any;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private alertController: AlertController,
    private encryptionService: EncryptionService
  ) { }

  ngOnInit() {
    const storedUserData = localStorage.getItem('userData');

    if (storedUserData) {
      // 🔓 Intentar descifrar los datos (si están encriptados)
      const userData = this.encryptionService.descifrarDatos(storedUserData);
      ////console.log(userData);
      if (userData) {
        //  console.log("🔓 Usuario autenticado:", userData);
        this.router.navigate(['/pedidos']); // 🔄 Redirige a menú si hay usuario
      } else {
        ////console.log("⚠️ Error al descifrar los datos, eliminando...");
        this.router.navigate(['/login']);
        localStorage.removeItem('userData'); // Elimina datos corruptos
      }
    }
  }


  

  async login() {
    if (this.bloqueado) {
      this.showAlert('Cuenta Bloqueada', `Inténtalo de nuevo en ${this.tiempoRestante} segundos.`);
      return;
    }

    if (!this.cedula || !this.password) {
      this.showAlert('Error', 'Ingrese su cedula y contraseña.');
      return;
    }
      //console.log(this.cedula, this.password);

    this.loginService.login(this.cedula, this.password).subscribe( response => {
      //console.log(response);
      if (response.respuesta.estado === true) {
        //console.log(response);
        
        const datosCifrados = this.encryptionService.cifrarDatos(response.data);
        localStorage.setItem('userData', datosCifrados);
        
        this.router.navigate(['/pedidos']); // Redirigir al menú después del login
        this.intentosFallidos = 0; // Reiniciar intentos al ingresar correctamente
      } else {
        this.intentosFallidos++;
        this.showAlert('Error', 'Credenciales incorrectas.');

        if (this.intentosFallidos >= 3) {
          this.bloquearUsuario();
        }
      }
    },error => {
      console.error('Error detectado:', error); // Muestra el error en la consola
      this.showAlert('Error', `No se pudo conectar con el servidor. Detalles: ${error.message || JSON.stringify(error)}`);
    });
  }

  bloquearUsuario() {
    this.bloqueado = true;
    this.tiempoRestante = 60; // 1 minuto de bloqueo
    this.showAlert('Cuenta Bloqueada', 'Has fallado 3 intentos. Espera 1 minuto para intentarlo nuevamente.');

    this.interval = setInterval(() => {
      this.tiempoRestante--;

      if (this.tiempoRestante <= 0) {
        clearInterval(this.interval);
        this.bloqueado = false;
        this.intentosFallidos = 0; // Reiniciar intentos después del desbloqueo
      }
    }, 1000);
  }

  crearCuenta() {
    this.router.navigate(['/crear-cuenta']); // Redirige a la página de registro
  }

  recuperarPassword() {
    this.router.navigate(['/recuperar-contrasena']); // Redirige a la recuperación de contraseña
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