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

  ionViewDidEnter() {
    setTimeout(() => {
      this.navCtrl.navigateForward('/login'); // Navega siempre
    }, 3000); // 3s de animación/splash
  }
}
