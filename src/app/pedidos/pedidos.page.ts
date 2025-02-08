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

  constructor(private ventasService: VentasService, private router: Router, private encryptionService: EncryptionService) {}

  ngOnInit() {
    const storedUserData = localStorage.getItem('userData');

    if (storedUserData) {
      // 🔓 Intentar descifrar los datos (si están cifrados)
      const userData = this.encryptionService.descifrarDatos(storedUserData);
      if (userData) {
        this.userData = userData;
      } else {
        this.cerrarSesion();
      }
    } else {
      this.cerrarSesion();
    }

    // Obtener mesas al iniciar
    this.obtenerMesas();
  }

  ionViewWillEnter() {
    // 🔄 Verificar si se necesita recargar la página
    if (window.history.state?.recargar) {
      //console.log("🔄 Recargando datos de pedidos...");
      this.obtenerMesas();
    }
  }

  // Método para obtener mesas del backend
  obtenerMesas() {
    const payload = { accion: 'obtenerMesas' };

    this.ventasService.todosAction(payload).subscribe(
      (response) => {
        //console.log(response);

        if (response?.respuesta?.estado) {
          let mesas = response.data || []; // Evitar valores nulos

          // Crear una lista de promesas para verificar si cada mesa tiene productos
          let promesas = mesas.map((mesa:any) => this.verificarMesaTieneProductos(mesa.id));

          // Ejecutar todas las promesas en paralelo
          Promise.all(promesas).then((resultados) => {
            // Asignar el campo `tieneProductos` a cada mesa
            this.mesas = mesas.map((mesa:any, index:any) => ({
              ...mesa,
              tieneProductos: resultados[index] // Resultado de la consulta
            }));

            //console.log("📌 Mesas actualizadas con estado de productos:", this.mesas);
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

// 🔍 Función auxiliar para verificar si una mesa tiene productos en detalle_temp
verificarMesaTieneProductos(mesaId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const payload = { accion: 'verificarProductosMesa', mesa: mesaId };

        this.ventasService.todosAction(payload).subscribe(
            (response) => {
                //console.log(`🔍 Verificando productos en mesa ${mesaId}:`, response);

                if (response?.respuesta?.estado && response.data?.productos > 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            },
            (error) => {
                console.error(`❌ Error al verificar productos en mesa ${mesaId}:`, error);
                resolve(false); // En caso de error, asumimos que no tiene productos
            }
        );
    });
}


  // Evento cuando se selecciona una mesa
  seleccionarMesa(mesa: any) {
    //console.log('📌 Mesa seleccionada:', mesa);
    // Redirigir usando el parámetro en la URL (Ejemplo: /menu/3)
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
