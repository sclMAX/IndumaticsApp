import { Component } from '@angular/core';
import { NavController, NavParams, Loading, Toast} from 'ionic-angular';
import {Perfil} from '../../../providers/perfiles/perfiles';
import {Color, Colores} from '../../../providers/colores/colores';
import {PedidoItem} from '../../../providers/pedidos/pedidos';

@Component({
  templateUrl: 'build/pages/pedidos/pedidos-add/pedidos-add.html',
  providers: [Colores],
})
export class PedidosAddPage {
  title: string;
  perfil: Perfil;
  colores: Array<Color>;
  pedidoItem: PedidoItem;

  constructor(private nav: NavController, private parametros: NavParams, private coloresP: Colores) {
    this.perfil = this.parametros.get('perfil');
    this.title = 'Perfil: ' + this.perfil.idPerfil;
    this.pedidoItem = new PedidoItem();
    this.pedidoItem.perfil = this.perfil;
    this.pedidoItem.cantidad = 1;
    this.pedidoItem.comentario = '';
  }

  ionViewWillEnter() {
    if (!this.colores) {
      let load = Loading.create({
        content: 'Cargando colores disponibles...',
        duration: 5000,
      });
      this.nav.present(load);
      this.coloresP.getAll()
        .subscribe(res => {
          this.colores = res;
          load.dismiss();
        })
        .catch(error => { 
           load.dismiss();
          console.error.bind(error) 
        })
        .complete(() => { load.dismiss() });
    }
  }
}



