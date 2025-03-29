import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ConexionGuard } from './guards/conexion.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule),
    canActivate: [ConexionGuard]
  },
  {
    path: 'crear-cuenta',
    loadChildren: () => import('./crear-cuenta/crear-cuenta.module').then(m => m.CrearCuentaPageModule),
    canActivate: [ConexionGuard]
  },
  {
    path: 'recuperar-contrasena',
    loadChildren: () => import('./recuperar-contrasena/recuperar-contrasena.module').then(m => m.RecuperarContrasenaPageModule),
    canActivate: [ConexionGuard]
  },
  {
    path: 'menu/:id',
    loadChildren: () => import('./menu/menu.module').then(m => m.MenuPageModule),
    canActivate: [ConexionGuard]
  },
  {
    path: 'perfil',
    loadChildren: () => import('./perfil/perfil.module').then(m => m.PerfilPageModule),
    canActivate: [ConexionGuard]
  },
  {
    path: 'pedidos',
    loadChildren: () => import('./pedidos/pedidos.module').then(m => m.PedidosPageModule),
    canActivate: [ConexionGuard]
  },
  {
    path: 'modal-editar-producto',
    loadChildren: () => import('./modal-editar-producto/modal-editar-producto.module').then(m => m.ModalEditarProductoPageModule),
    canActivate: [ConexionGuard]
  },
  {
    path: 'sin-conexion',
    loadChildren: () => import('./sin-conexion/sin-conexion.module').then(m => m.SinConexionPageModule)
    // ❗ No aplicar el guard aquí para evitar bucle
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
