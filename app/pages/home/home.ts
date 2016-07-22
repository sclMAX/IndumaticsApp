import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {CatalogoLineasPage} from '../catalogo/catalogo-lineas/catalogo-lineas';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  title: string;
  constructor(private navController: NavController) {
    this.title = 'INDUMATICS S.A.';
  }

  goCatalogo(){
    this.navController.push(CatalogoLineasPage);
  }
}
