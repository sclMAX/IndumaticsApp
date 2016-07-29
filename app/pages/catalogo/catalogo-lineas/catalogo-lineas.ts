import { Component } from '@angular/core';
import { NavController, Loading, Toast } from 'ionic-angular';
import {Lineas, LineasList, Linea} from '../../../providers/lineas/lineas';
import {CatalogoPerfilesPage} from '../catalogo-perfiles/catalogo-perfiles';

@Component({
  templateUrl: 'build/pages/catalogo/catalogo-lineas/catalogo-lineas.html',
  providers: [Lineas],
})
export class CatalogoLineasPage {
  lineas: Array<Linea>;
  constructor(private nav: NavController, private lineasP: Lineas) { }

  goPerfiles(l: Linea) {
    this.nav.push(CatalogoPerfilesPage, { linea: l });
  }
  ionViewWillEnter() {
    if (!this.lineas) {
      var l = Loading.create({
        content: 'Cargando lineas disponibles...',
      });
      this.nav.present(l);
      this.lineasP.getAll()
        .subscribe(data => {
          this.lineas = data.lineas;
          l.dismiss();
        }, error => {
          l.dismiss();
          let t = Toast.create({
            message:'Sin conexion!',
            duration:2000
          });
          this.nav.present(t);
        });
    }
  }
}
