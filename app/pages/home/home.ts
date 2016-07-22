import {Component} from '@angular/core';
import {NavController, Loading} from 'ionic-angular';
import {Lineas, Linea} from '../../providers/lineas/lineas';

@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: [Lineas],
})
export class HomePage {
  lineas: Array<Linea>;
  constructor(private navCtrl: NavController, private lineasP: Lineas) {
    this.lineasP.initDB();
  }

  ngOnInit() {
    var l = Loading.create({
      content: 'Cargando lineas disponibles...'
    });
    this.navCtrl.present(l);
    this.lineasP.getAll()
      .subscribe(data => {
        if (data) {
          this.lineas = data;
        } else {
          console.error.bind('Error sin datos');
        }
      }, error => {
        console.error.bind(error);
      }, compete => {
        l.dismiss();
      })
  }

  borrarDB($event) {
    this.lineasP.deleteDB();
  }
}
