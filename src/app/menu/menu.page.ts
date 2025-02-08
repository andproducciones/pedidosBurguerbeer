import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentasService } from '../services/ventas/ventas.service';
import { EncryptionService } from '../services/encriptacion/encriptacion.service';
import { ModalEditarProductoPage } from '../modal-editar-producto/modal-editar-producto.page'; // Importar el modal


@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MenuPage implements OnInit {
  userData: any;
  pedido: any[] = [];
  total: number = 0;
  mesa: number = 0;

  categorias: any[] = [];
  productos: any[] = [];

  categoriasFiltradas: any[] = [];
  productosFiltrados: any[] = [];

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private ventas: VentasService,
    private encryptionService: EncryptionService,
    private route: ActivatedRoute,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    // 🔐 Obtener datos del usuario desde localStorage
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
        const userData = this.encryptionService.descifrarDatos(storedUserData);
        if (userData) {
            this.userData = userData;
        } else {
            console.error("⚠️ Error al descifrar los datos del usuario. Cerrando sesión...");
            this.cerrarSesion();
            return; // Detiene la ejecución
        }
    } else {
        console.warn("⚠️ No se encontró información del usuario. Cerrando sesión...");
        this.cerrarSesion();
        return;
    }

// 🏷️ Obtener el ID de la mesa desde la URL
this.route.paramMap.subscribe(params => {
  const idMesa = params.get('id');

  if (!idMesa) {
      console.warn("⚠️ No se recibió el ID de la mesa en la URL");
      return;
  }

  this.mesa = parseInt(idMesa, 10); // Convertir a número
  //console.log("🟢 ID de la mesa obtenida:", this.mesa);

  // 📦 Mostrar modal para ingresar el nombre del cliente
  //this.mostrarModalNombreCliente();
  this.cargarPedidoMesa();
  this.obtenerProductos();

});
}

async mostrarModalNombreCliente() {
    const alert = await this.alertCtrl.create({
        header: "Nombre del cliente",
        inputs: [
            {
                name: "nombre",
                type: "text",
                placeholder: "Ej: Juan Pérez",
            },
        ],
        buttons: [
            {
                text: "Cancelar",
                role: "cancel",
                handler: () => {
                    //console.log("⚠️ Se canceló el ingreso del nombre.");
                    this.router.navigate(['/pedidos']);
                    return false; // Agregar un return explícito
                },
            },
            {
                text: "Guardar",
                handler: (data: any) => {
                    if (!data.nombre.trim()) {
                        console.warn("⚠️ Nombre inválido.");
                        return false; // Evitar que cierre el modal si el campo está vacío
                    }

                    //console.log("🟢 Nombre ingresado:", data.nombre);
                    this.actualizarNombreMesa(data.nombre);
                    //this.cargarPedidoMesa();
                    //this.obtenerProductos()
                    return true;
                },
            },
        ],
    });

    await alert.present();
}

// 🆕 Función para actualizar el nombre de la mesa
actualizarNombreMesa(nombre: string) {
    const payload = {
        accion: 'actualizarNombreMesa',
        mesa: this.mesa,
        nombre: nombre,
        //usuario: this.userData.usuario
    };

    this.ventas.todosAction(payload).subscribe(
        (response) => {
            if (response && response.respuesta.estado) {
                //console.log("✅ Nombre de la mesa actualizado:", response);
            } else {
                console.warn("⚠️ No se pudo actualizar el nombre de la mesa:", response.respuesta.response);
            }
        },
        (error) => {
            console.error("❌ Error en la solicitud:", error);
        }
    );
}


// 📌 Función para obtener los detalles del pedido de la mesa
cargarPedidoMesa() {
    if (!this.userData) {
        console.warn("⚠️ No se encontró información del usuario. No se puede cargar el pedido.");
        return;
    }

    const payload = {
        accion: 'searchForDetalle',
        mesa: this.mesa,
        usuario: this.userData.usuario
    };

    this.ventas.todosAction(payload).subscribe(
        (response) => {
            //console.log("✅ Respuesta del backend:", response);

            if (response && response.respuesta.estado && response.data.detalle != 0) {
                this.pedido = response.data.detalle.map((item: any) => ({
                    cantidad: item.cantidad,
                    producto: item.producto,
                    observaciones: item.observaciones || "",
                    precio_unitario: parseFloat(item.precio_unitario),
                    total: parseFloat(item.precio_total),
                    preparar: item.preparar,
                    correlativo: item.correlativo
                }));

                // Actualizar totales
                this.total = parseFloat(response.data.totales.total);
            } else {
                console.warn("⚠️ No se encontraron productos en la mesa:", response.respuesta.response);
                this.pedido = []; // Vacía el pedido si no hay productos
                this.total = 0;
                this.mostrarModalNombreCliente();
            }
        },
        (error) => {
            console.error("❌ Error al obtener el pedido de la mesa:", error);
            this.mostrarModalNombreCliente();
          }
    );
}


  obtenerProductos() {
    this.ventas.getProductos().subscribe(
      (response) => {
        ////console.log(response);
        ////console.log(response.data[0].url);
        if (response.respuesta.estado) {
          this.productos = response.data;
          ////console.log(this.productos);
          this.productosFiltrados = [...this.productos]; // Inicializa productos filtrados
        } else {
          //console.log('No se encontraron productos');
        }
      },
      (error) => {
        console.error('Error al obtener productos:', error);
      }
    );
  }

  buscarProducto(event: any) {
    const query = event.target.value.toLowerCase();
    this.productosFiltrados = this.productos.filter(producto =>
      producto.producto.toLowerCase().includes(query)
    );
  }


agregarProducto(productoId: any) {

  ////console.log(productoId);

  const payload = {
              accion: 'addProductoDetalle',
              producto: productoId,
              mesa: this.mesa,
              cantidad: 1,
              usuario: this.userData.usuario
              };

  this.ventas.todosAction(payload).subscribe(
    (response) => {

      //console.log(response);

      if (response && response.respuesta.estado) {
        ////console.log("✅ Respuesta del backend:", response);

        // Reemplazar el pedido con la respuesta del backend
        this.pedido = response.data.detalle.map((item: any) => ({
            cantidad: item.cantidad,
            producto: item.producto,
            observaciones: item.observaciones || "",
            precio_unitario: parseFloat(item.precio_unitario),
            total: parseFloat(item.precio_total),
            preparar: item.preparar,
            correlativo: item.correlativo
        }));

        // Actualizar totales y guardar en localStorage
        this.total = parseFloat(response.data.totales.total);
        //localStorage.setItem('pedido', JSON.stringify(this.pedido));

    } else {
        console.warn("⚠️ No se pudo agregar el producto:", response.respuesta.response);
    }

 });
}


  eliminarProducto(productoId: any) {  
      //console.log("🗑 Eliminando producto:", productoId);
  
      const payload = {
          accion: 'del_product_detalle', // Cambiar la acción para eliminar
          id_detalle: productoId,
          mesa: this.mesa,
          usuario: this.userData.usuario
      };
  
      this.ventas.todosAction(payload).subscribe(
          (response) => {

            //console.log(response);
              if (response && response.respuesta.estado) {
                  //console.log("✅ Producto eliminado correctamente:", response);
  
                  // Reemplazar el pedido con la nueva lista devuelta por el backend
                  this.pedido = response.data.detalle.map((item: any) => ({
                      cantidad: item.cantidad,
                      producto: item.producto,
                      observaciones: item.observaciones || "",
                      precio_unitario: parseFloat(item.precio_unitario),
                      total: parseFloat(item.precio_total),
                      preparar: item.preparar,
                      correlativo: item.correlativo
                  }));
  
                  // Actualizar los totales
                  this.total = parseFloat(response.data.totales.total);
                  //localStorage.setItem('pedido', JSON.stringify(this.pedido));
  
                  this.showToast("Producto eliminado correctamente.");
              } else {

                  this.pedido = [];
                  this.total = 0;
                  console.warn("⚠️ No se pudo eliminar el producto:", response.respuesta.response);
              }
          },
          (error) => {
              console.error("❌ Error en la solicitud:", error);
          }
      );
  }


  irPedidos() {
    this.router.navigate(['/pedidos'], { state: { recargar: true } });
  }

  irPerfil() {
    this.router.navigate(['/perfil']);
  }



  facturar(){

  }

  async prepararOrden() {
    const alert = await this.alertCtrl.create({
      header: 'Ingresar Nombre del Cliente',
      inputs: [
        {
          name: 'nombreCliente',
          type: 'text',
          placeholder: 'Nombre del Cliente'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            return true; // Asegura que esta ruta devuelva un valor
          }
        },
        {
          text: 'Aceptar',
          handler: (data) => {
            if (!data.nombreCliente.trim()) {
              this.showToast("⚠️ Debe ingresar un nombre válido.");
              return false; // Evita cerrar el modal si el campo está vacío
            }
  
            this.enviarOrden(data.nombreCliente);
            return true; // Asegura que esta ruta devuelva un valor
          }
        }
      ]
    });
  
    await alert.present();
  }
  

  enviarOrden(nombreCliente: string) {
    //console.log("🍽 Enviando orden para:", nombreCliente, "Mesa:", this.mesa);

    const payload = {
      accion: 'imprimirComanda2',
      mesa: this.mesa,
      nombre: nombreCliente,
      usuario: this.userData.usuario,
      nombre_mesero: this.userData.nombre,
      apellido_mesero: this.userData.apellido
    };

    this.ventas.todosAction(payload).subscribe(
      (response) => {
        if (response && response.respuesta.estado) {
          //console.log("✅ Orden enviada correctamente:", response);
          this.cargarPedidoMesa();
          this.showToast("✅ Orden enviada a cocina.");
        } else {
          console.warn("⚠️ No se pudo enviar la orden:", response);
          this.showToast("⚠️ No se pudo enviar la orden.");
        }
      },
      (error) => {
        console.error("❌ Error en la solicitud:", error);
        //console.log(error.error.text)
        this.showToast("❌ Error al procesar la orden.");
      }
    );
  }


  imprimirPreCuenta(){
    
  }

  cerrarSesion() {
    localStorage.removeItem('userData');
    this.router.navigate(['/login']);
    this.showToast('Sesión cerrada correctamente.');
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }





  //modal detalles
 
async abrirEditarProducto(producto: any) {
  //console.log("📝 Editando producto:", producto);

  const payload = {
    accion: 'formDetalleProducto2',
    co: producto.correlativo
  };

  this.ventas.todosAction(payload).subscribe(async (response) => {
    if (response && response.respuesta.estado) {

      //console.log(response)
      const atributos = response.data.atributos || [];
      const observaciones = "";
      const observacionesprevias = response.data.observaciones || "";

      // 📌 Crear modal sin usar un módulo
      const modal = await this.modalCtrl.create({
        component: ModalEditarProductoPage, // ✅ STANDALONE COMPONENT
        componentProps: {
          producto,
          atributos,
          observaciones,
          observacionesprevias
        }
      });

      await modal.present();

      // 📝 Obtener datos después de cerrar el modal
      const { data } = await modal.onWillDismiss();
      if (data) {
        //console.log("✅ Datos recibidos:", data);
        this.guardarEdicionProducto(producto.correlativo, data);
      }
    } else {
      console.warn("⚠️ No se encontraron atributos del producto.");
    }
  }, (error) => {
    console.error("❌ Error al obtener atributos del producto:", error);
  });
}

  guardarEdicionProducto(correlativo: number, data: any) {
    
    ////console.log("📝 Guardando edición del producto:", correlativo, data);
    const payload = {
      accion: 'editarProducto',
      co: correlativo,
      observaciones: data.observaciones || "",
      atributos: Object.keys(data.atributos).map(k => ({
        id: k,
        valor: data.atributos[k]
      }))
    };
  ////console.log(payload);
    this.ventas.todosAction(payload).subscribe((response) => {

      ////console.log(response);
      if (response && response.respuesta.estado) {
        //console.log("✅ Producto actualizado:", response);
        this.showToast("Producto actualizado correctamente.");
        this.cargarPedidoMesa(); // Recargar la lista de pedidos
      } else {
        console.warn("⚠️ No se pudo actualizar el producto.");
      }
    }, (error) => {
      console.error("❌ Error al actualizar el producto:", error);
    });
  }
  

}
