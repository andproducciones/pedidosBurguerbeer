import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalEditarProductoPage } from './modal-editar-producto.page';

const routes: Routes = [
  {
    path: '',
    component: ModalEditarProductoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalEditarProductoPageRoutingModule {}
