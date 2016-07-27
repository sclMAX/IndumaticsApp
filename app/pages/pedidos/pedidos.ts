import { Component } from '@angular/core';
import { NavController, NavParams, Loading, Toast, Alert} from 'ionic-angular';
import {Usuario, Usuarios} from '../../providers/usuarios/usuarios';
import {Pedido, Pedidos, PedidoItem} from '../../providers/pedidos/pedidos';
import {UsuarioPage} from './usuario/usuario';
import {CatalogoLineasPage} from '../catalogo/catalogo-lineas/catalogo-lineas';

@Component({
  templateUrl: 'build/pages/pedidos/pedidos.html',
  providers: [Usuarios, Pedidos]
})
export class PedidosPage {

  title: string;
  pedido: Pedido;
  items: Array<PedidoItem>;
  totalKilos: number;
  isModify: boolean;

  constructor(private nav: NavController, private parametros: NavParams,
    private usuariosP: Usuarios, private pedidosP: Pedidos) {
    this.title = "Detalle de pedido";
    this.isModify = false;
  }
  saveChanges() {
    this.pedido.items = this.items;
    this.pedidosP.save(this.pedido)
      .subscribe(res => {
        this.items = <Array<PedidoItem>>JSON.parse(JSON.stringify(this.pedido.items));
        this.isModify = false;
      }, error => {
        console.error(error);
      })
  };

  cancelChanges() {
    this.items = <Array<PedidoItem>>JSON.parse(JSON.stringify(this.pedido.items));
    this.isModify = false
  }

  removeItem(item) {
    let confirm = Alert.create({
      title: 'Quitar Item?',
      message: 'Esta seguro que desea quitar el item del pedido',
      buttons: [{ text: 'Cancelar' },
        {
          text: 'Aceptar',
          handler: () => {
            this.items.splice((this.items.findIndex(value => value === item)), 1);
            this.isModify = true;
          }
        }]
    });
    this.nav.present(confirm);
  };

  incCantidad(item) {
    let t = Toast.create({
      duration: 500,
      position: 'middle'
    });
    let c = ++this.items.find(value => value === item).cantidad;
    t.setMessage('Cantidad: ' + c);
    this.nav.present(t);
    this.isModify = true;
  }

  decCantidad(item) {
    let t = Toast.create({
      duration: 500,
      position: 'middle'
    });
    let c: number = 1;
    (this.items.find(value => value === item).cantidad > 1) ? c = --this.items.find(value => value === item).cantidad : 1;
    t.setMessage('Cantidad: ' + c);
    this.nav.present(t);
    this.isModify = true;
  }

  goConfiguracion() {
    this.nav.push(UsuarioPage);
  }

  goCatalogo() {
    this.nav.push(CatalogoLineasPage);
  }

  calcularSubtotal(item: PedidoItem): number {
    return item.cantidad * ((item.perfil.pxm * (item.perfil.largo / 1000))
      + ((item.perfil.pxm * (item.perfil.largo / 1000)) * (item.color.incremento / 100)));
  }

  calculaTotal(): number {
    if (this.items) {
      let total: number = 0;
      this.items.forEach(item => {
        total += this.calcularSubtotal(item);
      });
      return total;
    } else {
      return 0;
    }
  }

  sendPedido() {
    let load = Loading.create({
      content: 'ENVIANDO PEDIDO...',
      duration: 5000
    });
    this.nav.present(load);
    console.log('ENVIANDO PEDIDO....');
  }

  ionViewWillEnter() {
    let load = Loading.create({
      content: 'Buscando pedidos sin enviar...',
      duration: 3000
    });
    this.nav.present(load);
    this.pedidosP.getPedido()
      .subscribe(res => {
        this.pedido = res;
        this.items = <Array<PedidoItem>>JSON.parse(JSON.stringify(this.pedido.items));
        load.dismiss();
      },
      error => {
        load.dismiss();
      });
  }
}
