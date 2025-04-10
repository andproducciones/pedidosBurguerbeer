import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; // ✅ Importa HTTP_INTERCEPTORS

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ConexionInterceptor } from './services/interceptors/conexion.interceptor';



@NgModule({
  declarations: [AppComponent],
  imports: [ 
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: ConexionInterceptor, multi: true } // ✅ Registra el interceptor
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
