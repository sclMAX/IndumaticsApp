import {Component} from '@angular/core';
import {NavController, Loading} from 'ionic-angular';
import {CatalogoLineasPage} from '../catalogo/catalogo-lineas/catalogo-lineas';
import {ContactoPage} from '../contacto/contacto';
import {PedidosPage} from '../pedidos/pedidos';
import {Update} from '../../providers/update/update';
import {Colores} from '../../providers/colores/colores';

@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: [Update, Colores],
})

export class HomePage {

  title: string;
  isUpdate: boolean;
  updateMsg: string;
  updateFecha: Date;

  constructor(private nav: NavController, private update: Update, 
  private coloresP: Colores) {
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

  actualizar(){
    this.coloresP.initDB();
    this.coloresP.deleteDB();
  }

  ionViewWillEnter() {
    this.update.checkUpdate()
      .subscribe(res => {
        this.isUpdate = <boolean>JSON.parse(JSON.stringify(res.isUpdate));
        this.updateMsg = <string>JSON.parse(JSON.stringify(res.msg));
        this.updateFecha = <Date>JSON.parse(JSON.stringify(res.fecha));
        console.log('UPDATE FECHA:', this.updateFecha)
      });
  }
}
