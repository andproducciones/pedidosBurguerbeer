import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { PerfilService } from '../services/perfil/perfil.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false
})
export class PerfilPage implements OnInit {
  usuario: any = {
    cedula: '',
    nombre: '',
    apellido: '',
    correo: '',
    password: ''
  };

  constructor(
    private perfilService: PerfilService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      this.usuario = JSON.parse(userData);
    }
  }

  guardarCambios() {
    this.perfilService.actualizarPerfil(this.usuario).subscribe(async response => {
      if (response.estado) {
        localStorage.setItem('userData', JSON.stringify(this.usuario));
        this.showAlert('Éxito', 'Tus datos han sido actualizados correctamente.');
        window.location.reload();
      } else {
        this.showAlert('Error', 'No se pudo actualizar la información.');
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
}