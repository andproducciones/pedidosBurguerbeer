import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  constructor(private navCtrl: NavController) {}

  async ionViewDidEnter() {
    // Simula la animación del logo
    setTimeout(async () => {
      if (navigator.onLine) {
        // Redirige al login si hay conexión
        this.navCtrl.navigateForward('/login');
      } else {
        alert('No hay conexión a Internet. Inténtalo de nuevo.');
      }
    }, 3000); // Tiempo de la animación (3 segundos)
  }
}

