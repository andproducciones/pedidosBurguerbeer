import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactoService } from '../services/contacto/contacto.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MenuPage implements OnInit {
  userData: any;
  contactos: any = [];

  constructor(
    private router: Router,
    private contactoService: ContactoService,
    //private perfilService: PerfilService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    // Obtener datos del usuario desde la navegación o localStorage
    if (this.router.getCurrentNavigation()?.extras.state?.['userData']) {
      this.userData = this.router.getCurrentNavigation()?.extras.state?.['userData'];
      console.log('Datos del usuario desde navegación:', this.userData);
    } else {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        this.userData = JSON.parse(storedUserData);
        console.log('Datos del usuario desde localStorage:', this.userData);
      }else{
        this.cerrarSesion();
      }
    }

    this.cargarContactos();
  }

  cargarContactos() {
    this.contactoService.getContactos(this.userData.cod_persona).subscribe(
      (response: any) => {
        console.log('Respuesta del servidor:', response)
        this.contactos = response.data;
      },
      (error) => {
        this.showAlert('Error', 'No se pudo cargar la lista de contactos.');
      }
    );
  }

  abrirFormularioAgregar(idUser:any) {
    this.alertCtrl
      .create({
        header: 'Agregar Contacto',
        inputs: [
          { name: 'nombre_contacto', placeholder: 'Nombre', type: 'text' },
          { name: 'apellido_contacto', placeholder: 'Apellido', type: 'text' },
          { name: 'telefono_contacto', placeholder: 'Teléfono', type: 'tel' },
          { name: 'correo_contacto', placeholder: 'Email', type: 'email' },
        ],
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          {
            text: 'Guardar',
            handler: (data) => {
              this.agregarContacto(data,idUser);
            },
          },
        ],
      })
      .then((alert) => alert.present());
  }

  agregarContacto(data: any, idUser:any) {
    console.log(data);
    this.contactoService.addContacto(data,idUser).subscribe(
      (response: any) => {
        if (response.estado) {
          this.cargarContactos();
          this.showToast('Contacto agregado correctamente.');
        } else {
          this.showAlert('Error', 'No se pudo agregar el contacto.');
        }
      },
      (error) => {
        this.showAlert('Error', 'No se pudo conectar con el servidor.');
      }
    );
  }

  editarContacto(cod_contacto:any,contacto: any) {
    this.alertCtrl
      .create({
        header: 'Editar Contacto',
        inputs: [
          { name: 'nombre_contacto', value: contacto.nombre_contacto, type: 'text' },
          { name: 'apellido_contacto', value: contacto.apellido_contacto, type: 'text' },
          { name: 'telefono_contacto', value: contacto.telefono_contacto, type: 'tel' },
          { name: 'correo_contacto', value: contacto.correo_contacto, type: 'email' },
        ],
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          {
            text: 'Guardar',
            handler: (data) => {
              this.actualizarContacto(cod_contacto, data);
            },
          },
        ],
      })
      .then((alert) => alert.present());
  }

  actualizarContacto(cod_contacto: any, data: any) {
    console.log(data);
    this.contactoService.updateContacto(cod_contacto, data).subscribe(
      
      (response: any) => {
        console.log(response);
        if (response.estado) {
          this.cargarContactos();
          this.showToast('Contacto actualizado correctamente.');
        } else {
          this.showAlert('Error', 'No se pudo actualizar el contacto.');
        }
      },
      (error) => {
        this.showAlert('Error', 'No se pudo conectar con el servidor.');
      }
    );
  }

  eliminarContacto(cod_contacto: any) {
    console.log(cod_contacto);
    this.contactoService.deleteContacto(cod_contacto).subscribe(
      (response: any) => {
        console.log(response);
        if (response.estado) {
          this.cargarContactos();
          this.showToast('Contacto eliminado correctamente.');
        } else {
          this.showAlert('Error', 'No se pudo eliminar el contacto.');
        }
      },
      (error) => {
        this.showAlert('Error', 'No se pudo conectar con el servidor.');
      }
    );
  }

  irContactos() {
    this.router.navigate(['/menu']);
  }

  irPerfil() {
    this.router.navigate(['/perfil']);
  }

  cerrarSesion() {
    localStorage.removeItem('userData'); // Eliminar datos de sesión
    this.router.navigate(['/login']); // Redirigir al login
    this.showToast('Sesión cerrada correctamente.');
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}


