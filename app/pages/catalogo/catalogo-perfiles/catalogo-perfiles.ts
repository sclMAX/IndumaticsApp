import { Component } from '@angular/core';
import { NavController, NavParams, Loading } from 'ionic-angular';
import {Perfiles, Perfil} from '../../../providers/perfiles/perfiles';
import {Linea} from '../../../providers/lineas/lineas';

@Component({
  templateUrl: 'build/pages/catalogo/catalogo-perfiles/catalogo-perfiles.html',
  providers: [Perfiles],
})
export class CatalogoPerfilesPage {
  perfiles: Array<Perfil>;
  private perfilesAll: Array<Perfil>;
  private perfilesAllLinea: Array<Perfil>;
  linea: Linea;
  title: string;

  constructor(private nav: NavController, private parametros: NavParams, private perfilesP: Perfiles) {
    this.perfilesP.initDB();
    this.linea = this.parametros.get('linea');
    this.title = 'Linea ' + this.linea.linea;
  }

  goPerfil(p: Perfil) {
    //   this.nav.push(CatalogoPerfilesDetallePage,{perfil: p});
  }

  addPedido(p: Perfil) {
    //   this.nav.push(PedidosAddPage,{perfil:p});
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

  ionViewWillEnter() {
    if (!this.perfiles) {
      var l = Loading.create({
        content: 'Cargando perfiles de la linea ' + this.linea.linea + '...'
      });
      this.nav.present(l);
      this.perfilesP.getAll()
        .subscribe(data => {
          if (data) {
            this.perfilesAll = data;
            for (let i = 0; i < this.perfilesAll.length; i++) {
              if (this.perfilesAll[i].idlinea === this.linea.id) {
                this.perfilesAllLinea.push(this.perfilesAll[i]);
              }
            }
            this.perfiles = this.perfilesAllLinea;
          } else {
            console.error.bind('Error sin datos');
          }
          l.dismiss();
        }, error => {
          l.dismiss();
          console.error.bind(error);
        }, complete => {
          l.dismiss();
        })
    }
  }
}
