import { Component, OnInit } from '@angular/core';
import { VentasService } from '../services/ventas/ventas.service';
import { Router } from '@angular/router';
import { EncryptionService } from '../services/encriptacion/encriptacion.service';
import { ConexionService } from '../services/conexion/conexion.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
  standalone: false
})
export class PedidosPage {
  mesas: any[] = []; // Lista de mesas
  userData: any;
  cargando: boolean = true;


  constructor(
    private ventasService: VentasService,
    private router: Router,
    private encryptionService: EncryptionService,
    private conexionService: ConexionService
  ) {}



  // 🔁 Se ejecuta SIEMPRE al ingresar a la vista
  async ionViewWillEnter() {
    const conectado = await this.conexionService.forzarVerificacionManual();
  
    if (!conectado) {
      this.router.navigate(['/sin-conexion']);
      return;
    }

    //console.log(conectado)
    const storedUserData = localStorage.getItem('userData');

    if (storedUserData) {
      const userData = this.encryptionService.descifrarDatos(storedUserData);
      if (userData) {
        this.userData = userData;
      } else {
        this.cerrarSesion();
      }
    } else {
      this.cerrarSesion();
    }
    this.cargando = true;
    this.obtenerMesas();
  }

  // 🔄 Obtener mesas del backend
  obtenerMesas() {
    const payload = { accion: 'obtenerMesas' };

    this.ventasService.todosAction(payload).subscribe(
      (response) => {
        if (response?.respuesta?.estado) {
          const mesas = response.data || [];

          // Verificar si cada mesa tiene productos (detalle_temp)
          const promesas = mesas.map((mesa: any) =>
            this.verificarMesaTieneProductos(mesa.id)
          );

          Promise.all(promesas).then((resultados) => {
            this.mesas = mesas.map((mesa: any, index: number) => ({
              ...mesa,
              estado: resultados[index], // 0, 2 o 3
            }));
            this.cargando = false;
          });
          
          
       
        } else {
          console.error('⚠️ No se encontraron mesas.');
          this.mesas = [];
          this.cargando = false;
        }
      },
      (error) => {
        console.error('❌ Error al obtener mesas:', error);
      }
    );
  }

  verificarMesaTieneProductos(mesaId: number): Promise<number> {
    return new Promise((resolve) => {
      const payload = { accion: 'verificarProductosMesa', mesa: mesaId };
  
      this.ventasService.todosAction(payload).subscribe(
        (response) => {
          //console.log(`✅ Verificación de mesa ${mesaId}:`, response.data);
          if (response?.respuesta?.estado) {
            resolve(response.data.estado); // 0, 2 o 3
          } else {
            resolve(0);
          }
        },
        (error) => {
          console.error(`❌ Error al verificar mesa ${mesaId}:`, error);
          resolve(0);
        }
      );
    });
  }
  

  // 🟢 Redirige al menú de la mesa
  seleccionarMesa(mesa: any) {
    this.router.navigate([`/menu/${mesa.id}`], { state: { recargar: true } });
  }

  irPerfil() {
    this.router.navigate(['/perfil']);
  }

  cerrarSesion() {
    this.router.navigate(['/login']);
    localStorage.removeItem('userData');
  }
}
