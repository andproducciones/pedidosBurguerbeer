import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalEditarProductoPageRoutingModule } from './modal-editar-producto-routing.module';

import { ModalEditarProductoPage } from './modal-editar-producto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalEditarProductoPageRoutingModule
  ],
  
})
export class ModalEditarProductoPageModule {}
