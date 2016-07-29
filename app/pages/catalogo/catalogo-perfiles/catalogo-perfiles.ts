import { Component } from '@angular/core';
import { NavController, NavParams, Loading, Toast} from 'ionic-angular';
import {Perfiles, PerfilesList, Perfil} from '../../../providers/perfiles/perfiles';
import {Linea} from '../../../providers/lineas/lineas';
import {CatalogoPerfilesDetallePage} from './catalogo-perfiles-detalle/catalogo-perfiles-detalle';
import {PedidosAddPage} from '../../pedidos/pedidos-add/pedidos-add';
import {PedidosPage} from '../../pedidos/pedidos';
import {HomePage} from '../../home/home';

@Component({
  templateUrl: 'build/pages/catalogo/catalogo-perfiles/catalogo-perfiles.html',
  providers: [Perfiles],
})
export class CatalogoPerfilesPage {
  perfiles: Array<Perfil>;
  private perfilesAll: Array<Perfil>;
  private perfilesAllLinea: Array<Perfil>;
  private linea: Linea;
  title: string;

  constructor(private nav: NavController, private parametros: NavParams, private perfilesP: Perfiles) {
    this.perfilesP.initDB();
    this.linea = this.parametros.get('linea');
    this.title = 'Linea ' + this.linea.linea;
  }

  goPerfil(p: Perfil) {
    this.nav.push(CatalogoPerfilesDetallePage, { perfil: p });
  }

  addPedido(p: Perfil) {
    this.nav.push(PedidosAddPage, { perfil: p });
  }

  filtrar(ev) {
    this.perfiles = this.perfilesAllLinea;
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.perfiles = this.perfiles.filter((perfil) => {
        return ((perfil.idPerfil + perfil.descripcion).toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  goPedidos() {
    this.nav.push(PedidosPage);
  }

  goHome(){
    this.nav.setRoot(HomePage);
  }

  ionViewWillEnter() {
    if (!this.perfiles) {
      let l = Loading.create({
        content: 'Cargando perfiles de la linea ' + this.linea.linea + '...',
      });
      this.nav.present(l);
      this.perfilesP.getAll()
        .subscribe(data => {
          this.perfilesAll = data.perfiles;
          this.perfiles = this.perfilesAllLinea = this.perfilesAll.filter((perfil) => {
            return (perfil.idlinea === this.linea.id);
          });
          l.dismiss();
        }, error => {
          l.dismiss();
          let t = Toast.create({
            message: 'Sin conexion!',
            duration: 2000
          })
        });
    }
  }
}
