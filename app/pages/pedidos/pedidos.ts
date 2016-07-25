import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Usuario} from '../../providers/usuarios/usuarios';
import {UsuarioPage} from './usuario/usuario';

@Component({
  templateUrl: 'build/pages/pedidos/pedidos.html',
})
export class PedidosPage {

  title: string;
  usuario: Usuario;

  constructor(private nav: NavController, private parametros: NavParams) {
    this.usuario = this.parametros.get('usuario');
    this.title = "Detalle de pedido";
  }

  goConfiguracion() {
    this.nav.push(UsuarioPage, { usuario: this.usuario });
  }

}
