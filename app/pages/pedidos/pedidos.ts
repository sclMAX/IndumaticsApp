import { Component } from '@angular/core';
import { NavController, NavParams, Loading} from 'ionic-angular';
import {Usuario, Usuarios} from '../../providers/usuarios/usuarios';
import {Pedido} from '../../providers/pedidos/pedidos';
import {UsuarioPage} from './usuario/usuario';

@Component({
  templateUrl: 'build/pages/pedidos/pedidos.html',
  providers: [Usuarios]
})
export class PedidosPage {

  title: string;
  usuario: Usuario;
  pedido: Pedido;

  constructor(private nav: NavController, private parametros: NavParams, private usuariosP: Usuarios) {
    this.usuario = this.parametros.get('usuario');
    this.title = "Detalle de pedido";
  }

  goConfiguracion() {
    this.nav.push(UsuarioPage, { usuario: this.usuario });
  }

  sendPedido() {
    console.log('ENVIANDO PEDIDO....');
  }

  ionViewWillEnter() {
    let load = Loading.create({
      content: 'Buscando Usuario...',
      duration: 3000
    });
    if (!this.usuario) {
      this.nav.present(load);
      this.usuariosP.getUsuario()
        .subscribe(res => {
          this.usuario = res;
          load.dismiss();
        },
        error => {
          load.dismiss();
        });
    }
  }
}
