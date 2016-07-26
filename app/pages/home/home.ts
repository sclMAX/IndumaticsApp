import {Component} from '@angular/core';
import {NavController, Loading} from 'ionic-angular';
import {CatalogoLineasPage} from '../catalogo/catalogo-lineas/catalogo-lineas';
import {ContactoPage} from '../contacto/contacto';
import {PedidosPage} from '../pedidos/pedidos';

@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: [],
})

export class HomePage {

  title: string;

  constructor(private nav: NavController) {
    this.title = 'INDUMATICS S.A.';
  }

  goCatalogo() {
    this.nav.push(CatalogoLineasPage);
  }

  goContacto() {
    this.nav.push(ContactoPage);
  }

  goPedidos() {
    this.nav.push(PedidosPage, { usuario: null });
  }
}
