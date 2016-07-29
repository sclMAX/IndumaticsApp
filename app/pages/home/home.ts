import {Component} from '@angular/core';
import {NavController, Toast, Loading} from 'ionic-angular';
import {Observable} from "rxjs/Observable";
import {CatalogoLineasPage} from '../catalogo/catalogo-lineas/catalogo-lineas';
import {ContactoPage} from '../contacto/contacto';
import {PedidosPage} from '../pedidos/pedidos';
import {Update} from '../../providers/update/update';
import {Colores} from '../../providers/colores/colores';
import {Lineas} from '../../providers/lineas/lineas';
import {Perfiles} from '../../providers/perfiles/perfiles';

@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: [Update, Colores, Lineas, Perfiles],
})

export class HomePage {

  title: string;
  isUpdate: boolean;
  updateMsg: string;
  updateFecha: Date;

  constructor(private nav: NavController, private update: Update,
    private coloresP: Colores, private lineasP: Lineas, private perfilesP: Perfiles) {
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

  actualizar() {
    let load = Loading.create({
      content: 'Actualizando...',
    });
    let t = Toast.create({
      duration: 2000
    });
    let msg: string = '';
    this.nav.present(load);
    Observable.create(obs => {
      this.lineasP.update(true)
        .subscribe(res => {
          msg += ' Lineas -> OK ';
          this.perfilesP.update(true)
            .subscribe(res => {
              msg += ' Perfiles -> OK ';
              this.coloresP.update(true)
                .subscribe(res => {
                  msg += ' Colores -> OK ';
                  obs.next(res);
                }, error => {
                  msg += ' Colores -> ERROR ';
                  obs.error(error);
                });
              obs.next(res);
            }, error => {
              msg += ' Perfiles -> ERROR ';
              obs.error(error);
            });
          obs.next(res);
        }, error => {
          msg += ' Lineas -> ERROR ';
          obs.error(error);
        });
    }).subscribe(res => {
      load.dismiss();
      t.setMessage('Datos actualizados correctamente![ ' + msg + ']');
      this.nav.present(t);
      this.isUpdate = false;
    }, error => {
      load.dismiss();
      t.setMessage('No se pudo actualizar![' + msg + ']');
      this.nav.present(t);
      console.error.bind(error);
    });
  }

  ionViewWillEnter() {
    Observable.create(obs => {
      let isU: boolean = false;
      this.update.checkUpdate()
        .subscribe(res => {
          this.updateMsg = <string>JSON.parse(JSON.stringify(res.msg));
          this.updateFecha = <Date>JSON.parse(JSON.stringify(res.fecha));
          this.lineasP.getAll()
            .subscribe(res => {
              this.isUpdate = this.updateFecha > res.fua;
              obs.next();
            }, error => {
              obs.error(error);
            });
          obs.next();
        }, error => {
          obs.error(error);
        });
    }).subscribe(res => {

    }, error => {
      this.isUpdate = false;
      console.error.bind(error);
    });
  }
}
