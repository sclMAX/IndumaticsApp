import {Component} from '@angular/core';
import {NavController, Platform, Alert} from 'ionic-angular';
import {CatalogoLineasPage} from '../catalogo/catalogo-lineas/catalogo-lineas';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  title: string;
  constructor(private nav: NavController, private platform: Platform) {
    this.title = 'INDUMATICS S.A.';
  }

  goCatalogo() {
    this.nav.push(CatalogoLineasPage);
  }
}
