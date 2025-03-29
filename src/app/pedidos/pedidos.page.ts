import { Component, OnInit } from '@angular/core';
import { VentasService } from '../services/ventas/ventas.service';
import { Router } from '@angular/router';
import { EncryptionService } from '../services/encriptacion/encriptacion.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
  standalone: false
})
export class PedidosPage implements OnInit {
  mesas: any[] = []; // Lista de mesas
  userData: any;

  constructor(
    private ventasService: VentasService,
    private router: Router,
    private encryptionService: EncryptionService
  ) {}

  ngOnInit() {
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
  }

  // 🔁 Se ejecuta SIEMPRE al ingresar a la vista
  ionViewWillEnter() {
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
              tieneProductos: resultados[index],
            }));
          });
        } else {
          console.error('⚠️ No se encontraron mesas.');
          this.mesas = [];
        }
      },
      (error) => {
        console.error('❌ Error al obtener mesas:', error);
      }
    );
  }

  // ✅ Verifica si una mesa tiene productos en detalle_temp
  verificarMesaTieneProductos(mesaId: number): Promise<boolean> {
    return new Promise((resolve) => {
      const payload = { accion: 'verificarProductosMesa', mesa: mesaId };

      this.ventasService.todosAction(payload).subscribe(
        (response) => {
          if (response?.respuesta?.estado && response.data?.productos > 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        (error) => {
          console.error(`❌ Error al verificar mesa ${mesaId}:`, error);
          resolve(false); // En caso de error, se asume que no tiene productos
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
    localStorage.removeItem('userData');
    this.router.navigate(['/login']);
  }
}
