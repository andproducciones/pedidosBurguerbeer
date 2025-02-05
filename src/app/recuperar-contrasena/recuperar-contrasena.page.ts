import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { PersonaService } from '../services/persona/persona.service';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.page.html',
  styleUrls: ['./recuperar-contrasena.page.scss'],
  standalone: false
})
export class RecuperarContrasenaPage {

  correo: string = '';

  constructor(
    private personaService: PersonaService,
    private router: Router,
    private alertController: AlertController
  ) { }

  async recuperarPassword() {
    if (!this.correo) {
      this.showAlert('Error', 'Por favor ingresa tu correo.');
      return;
    }

    this.personaService.recuperarPassword(this.correo).subscribe(async response => {
      if (response.estado) {
        this.showAlert('Éxito', 'Te hemos enviado un correo con instrucciones.');
        this.router.navigate(['/login']);
      } else {
        this.showAlert('Error', 'No encontramos una cuenta con ese correo.');
      }
    }, error => {
      this.showAlert('Error', 'No se pudo conectar con el servidor.');
    });
  }

  async showAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  volverLogin() {
    this.router.navigate(['/login']);
  }
}