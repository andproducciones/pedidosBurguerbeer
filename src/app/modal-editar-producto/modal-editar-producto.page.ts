import { Component, Input } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-editar-producto',
  templateUrl: './modal-editar-producto.page.html',
  styleUrls: ['./modal-editar-producto.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule] 
})
export class ModalEditarProductoPage {
  @Input() producto: any;
  @Input() atributos: any[] = [];
  @Input() observaciones: string = "";
  @Input() observacionesprevias: string = "";

  
  
  seleccionados: { [key: string]: string } = {}; // Almacenar selección de cada atributo

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    // Inicializar selección si ya había algo guardado
    

    ////console.log(this.observaciones);
    this.observacionesprevias = Object.values(this.observacionesprevias).join(', ');
    //console.log(this.producto);
  }

  // Guardar cambios y cerrar el modal
  guardarCambios() {
    this.modalCtrl.dismiss({
      producto: this.producto,
      observaciones: this.observaciones,
      atributos: this.seleccionados
    });
  }

  // Cerrar sin guardar
  cerrarModal() {
    this.modalCtrl.dismiss();
  }
}
