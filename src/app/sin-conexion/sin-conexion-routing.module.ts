import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SinConexionPage } from './sin-conexion.page';

const routes: Routes = [
  {
    path: '',
    component: SinConexionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SinConexionPageRoutingModule {}
