import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentasService } from '../services/ventas/ventas.service';
import { EncryptionService } from '../services/encriptacion/encriptacion.service';
import { ModalEditarProductoPage } from '../modal-editar-producto/modal-editar-producto.page';
import { ConexionService } from '../services/conexion/conexion.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MenuPage{
  userData: any;
  pedido: any[] = [];
  total: number = 0;
  mesa: number = 0;

  categorias: any[] = [];
  productos: any[] = [];
  categoriasFiltradas: any[] = [];
  productosFiltrados: any[] = [];

  cargando: boolean = true; // ✅ Mostrar loading

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private ventas: VentasService,
    private encryptionService: EncryptionService,
    private route: ActivatedRoute,
    private modalCtrl: ModalController,
    private conexionService: ConexionService
    
  ) {}

  async ionViewWillEnter(){
    const conectado = await this.conexionService.forzarVerificacionManual();
  
    if (!conectado) {
      this.router.navigate(['/sin-conexion']);
      return;
    }

    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const userData = this.encryptionService.descifrarDatos(storedUserData);
      if (userData) {
        this.userData = userData;
      } else {
        this.cerrarSesion();
        return;
      }
    } else {
      this.cerrarSesion();
      return;
    }

    this.route.paramMap.subscribe(params => {
      const idMesa = params.get('id');
      if (!idMesa) return;

      this.mesa = parseInt(idMesa, 10);
      this.cargarPedidoMesa();
      this.obtenerProductos();
    });
  }

  verificarCargaCompleta() {
    if (this.productos.length > 0 && this.pedido !== null) {
      this.cargando = false;
    }
  }

  cargarPedidoMesa() {
    if (!this.userData) return;

    const payload = {
      accion: 'searchForDetalle',
      mesa: this.mesa,
      usuario: this.userData.usuario
    };

    this.ventas.todosAction(payload).subscribe(
      (response) => {
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
          this.total = parseFloat(response.data.totales.total);
        } else {
          this.pedido = [];
          this.total = 0;
          this.mostrarModalNombreCliente();
        }

        this.verificarCargaCompleta();
      },
      (error) => {
        console.error("❌ Error al obtener el pedido de la mesa:", error);
        this.pedido = [];
        this.total = 0;
        this.verificarCargaCompleta();
        this.mostrarModalNombreCliente();
      }
    );
  }

  obtenerProductos() {
    this.ventas.getProductos().subscribe(
      (response) => {
        if (response.respuesta.estado) {
          this.productos = response.data;
          this.productosFiltrados = [...this.productos];
        }
        this.verificarCargaCompleta();
      },
      (error) => {
        console.error('❌ Error al obtener productos:', error);
        this.verificarCargaCompleta();
      }
    );
  }

  buscarProducto(event: any) {
    const query = event.target.value.toLowerCase();
    this.productosFiltrados = this.productos.filter(producto =>
      producto.producto.toLowerCase().includes(query)
    );
  }

  seleccionarMesa(mesa: any) {
    this.router.navigate([`/menu/${mesa.id}`], { state: { recargar: true } });
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

  async mostrarModalNombreCliente() {
    const alert = await this.alertCtrl.create({
      header: "Nombre del cliente",
      inputs: [
        {
          name: "nombre",
          type: "text",
          placeholder: "Ej: Juan Pérez",
          value: 'Cliente',
        },
      ],
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          handler: () => {
            this.actualizarNombreMesa('');
            this.router.navigate(['/pedidos']);
            return false;
          },
        },
        {
          text: "Guardar",
          handler: (data: any) => {
            if (!data.nombre.trim()) return false;
            this.actualizarNombreMesa(data.nombre);
            return true;
          },
        },
      ],
    });

    await alert.present();
  }

  actualizarNombreMesa(nombre: string) {
    const payload = {
      accion: 'actualizarNombreMesa',
      mesa: this.mesa,
      nombre: nombre
    };

    this.ventas.todosAction(payload).subscribe();
  }

  agregarProducto(productoId: any) {
    const payload = {
      accion: 'addProductoDetalle',
      producto: productoId,
      mesa: this.mesa,
      cantidad: 1,
      usuario: this.userData.usuario
    };

    this.ventas.todosAction(payload).subscribe(
      (response) => {
        if (response && response.respuesta.estado) {
          this.pedido = response.data.detalle.map((item: any) => ({
            cantidad: item.cantidad,
            producto: item.producto,
            observaciones: item.observaciones || "",
            precio_unitario: parseFloat(item.precio_unitario),
            total: parseFloat(item.precio_total),
            preparar: item.preparar,
            correlativo: item.correlativo
          }));

          this.total = parseFloat(response.data.totales.total);
        }
      }
    );
  }

  eliminarProducto(productoId: any) {
    const payload = {
      accion: 'del_product_detalle',
      id_detalle: productoId,
      mesa: this.mesa,
      usuario: this.userData.usuario
    };

    this.ventas.todosAction(payload).subscribe(
      (response) => {
        if (response && response.respuesta.estado) {
          this.pedido = response.data.detalle.map((item: any) => ({
            cantidad: item.cantidad,
            producto: item.producto,
            observaciones: item.observaciones || "",
            precio_unitario: parseFloat(item.precio_unitario),
            total: parseFloat(item.precio_total),
            preparar: item.preparar,
            correlativo: item.correlativo
          }));

          this.total = parseFloat(response.data.totales.total);
          this.showToast("Producto eliminado correctamente.");
        } else {
          this.pedido = [];
          this.total = 0;
        }
      },
      (error) => {
        console.error("❌ Error en la solicitud:", error);
      }
    );
  }

  async abrirEditarProducto(producto: any) {
    const payload = {
      accion: 'formDetalleProducto2',
      co: producto.correlativo
    };

    this.ventas.todosAction(payload).subscribe(async (response) => {
      if (response && response.respuesta.estado) {
        const atributos = response.data.atributos || [];
        const observacionesprevias = response.data.observaciones || "";

        const modal = await this.modalCtrl.create({
          component: ModalEditarProductoPage,
          componentProps: {
            producto,
            atributos,
            observaciones: "",
            observacionesprevias
          }
        });

        await modal.present();

        const { data } = await modal.onWillDismiss();
        if (data) {
          this.guardarEdicionProducto(producto.correlativo, data);
        }
      }
    });
  }

  guardarEdicionProducto(correlativo: number, data: any) {
    const payload = {
      accion: 'editarProducto',
      co: correlativo,
      observaciones: data.observaciones || "",
      atributos: Object.keys(data.atributos).map(k => ({
        id: k,
        valor: data.atributos[k]
      }))
    };

    this.ventas.todosAction(payload).subscribe((response) => {
      if (response && response.respuesta.estado) {
        this.showToast("Producto actualizado correctamente.");
        this.cargarPedidoMesa();
      }
    });
  }

  irPedidos() {
    this.router.navigate(['/pedidos'], { state: { recargar: true } });
  }

  irPerfil() {
    this.router.navigate(['/perfil']);
  }

  facturar() {}

  async prepararOrden() {
    const alert = await this.alertCtrl.create({
      header: 'Ingresar Nombre del Cliente',
      inputs: [{ name: 'nombreCliente', type: 'text', placeholder: 'Nombre del Cliente' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Aceptar',
          handler: (data) => {
            if (!data.nombreCliente.trim()) {
              this.showToast("⚠️ Debe ingresar un nombre válido.");
              return false;
            }
            this.enviarOrden(data.nombreCliente);
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  enviarOrden(nombreCliente: string) {
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
        //console.log(response);
        if (response && response.respuesta.estado) {
          this.cargarPedidoMesa();
          this.showToast("✅ Orden impresa.");
        } else {
          //this.cargarPedidoMesa();
          this.showToast("⚠️ Orden no impresa.");
        }
      },
      (error) => {
        this.showToast("❌ Error al procesar la orden.");
      }
    );
  }

  marcarServido(correlativo: any) {
    //const mesa = this.mesa;
    //const usuario = this.userData.usuario;
  
    this.ventas.marcarServido(correlativo).subscribe({
      next: (res: any) => {
        console.log(res)
        if (res.respuesta.estado) {
          //res.preparar = 3;
          this.presentToast('✅ Producto marcado como servido');
          this.cargarPedidoMesa();

        } else {
          this.presentToast(res.response || 'No se pudo marcar como servido');
        }
      },
      error: () => {
        this.presentToast('❌ Error al conectar con el servidor');
      }
    });
  }
  
  private async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
  }
  

  imprimirPreCuenta() {}
}
