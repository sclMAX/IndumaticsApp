import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Perfil} from '../../providers/perfiles/perfil';
import {PedidosAddPage} from '../pedidos-add/pedidos-add';

@Component({
  templateUrl: 'build/pages/catalogo-perfiles-detalle/catalogo-perfiles-detalle.html',
})
export class CatalogoPerfilesDetallePage {
  title: string;
  perfil: Perfil;

  constructor(private nav: NavController, private parametros: NavParams) {
    this.perfil = this.parametros.get('perfil');
    this.title = 'Perfil: ' + this.perfil.idPerfil;
  }

  addPedido(p: Perfil) {
    this.nav.push(PedidosAddPage, { perfil: p });
  }

}
