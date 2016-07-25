import { Component } from '@angular/core';
import { NavController, Loading } from 'ionic-angular';
import {Lineas, Linea} from '../../../providers/lineas/lineas';
import {CatalogoPerfilesPage} from '../catalogo-perfiles/catalogo-perfiles';

@Component({
  templateUrl: 'build/pages/catalogo/catalogo-lineas/catalogo-lineas.html',
  providers: [Lineas],
})
export class CatalogoLineasPage {
  lineas: Array<Linea>;
  constructor(private nav: NavController, private lineasP: Lineas) {
    this.lineasP.initDB();
  }

  goPerfiles(l: Linea) {
    this.nav.push(CatalogoPerfilesPage, { linea: l });
  }
  ionViewWillEnter() {
    if (!this.lineas) {
      var l = Loading.create({
        content: 'Cargando lineas disponibles...',
        duration: 5000,
      });
      this.nav.present(l);
      this.lineasP.getAll()
        .subscribe(data => {
          if (data) {
            this.lineas = data;
          } else {
            console.error.bind('Error sin datos');
          }
          l.dismiss();
        }, error => {
          l.dismiss();
          console.error.bind(error);
        });
    }
  }
}
