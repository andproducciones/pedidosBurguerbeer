import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SinConexionPageRoutingModule } from './sin-conexion-routing.module';

import { SinConexionPage } from './sin-conexion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SinConexionPageRoutingModule
  ],
  declarations: [SinConexionPage]
})
export class SinConexionPageModule {}
