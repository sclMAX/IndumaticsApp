import { Component, Pipe} from '@angular/core';
import { NavController, NavParams, Loading, Toast} from 'ionic-angular';
import {Perfil} from '../../../providers/perfiles/perfiles';
import {Color, Colores} from '../../../providers/colores/colores';
import {PedidoItem} from '../../../providers/pedidos/pedidos';
import {FormBuilder, ControlGroup, Validators} from '@angular/common';

@Component({
  templateUrl: 'build/pages/pedidos/pedidos-add/pedidos-add.html',
  providers: [Colores],
})
export class PedidosAddPage {

  addForm: ControlGroup;
  title: string;
  perfil: Perfil;
  colores: Array<Color>;
  pedidoItem: PedidoItem;
  pesoTotal: number;

  constructor(private nav: NavController, private parametros: NavParams,
    private coloresP: Colores, private formBuilder: FormBuilder) {
    this.addForm = this.createForm();
    this.perfil = this.parametros.get('perfil');
    this.title = 'Perfil: ' + this.perfil.idPerfil;
    this.pedidoItem = new PedidoItem();
    this.pedidoItem.perfil = this.perfil;
    this.pedidoItem.cantidad = 1;
    this.pedidoItem.comentario = '';
  }

  private createForm() {
    return this.formBuilder.group({
      cantidad: ['', Validators.required],
      color: ['', Validators.required]
    });
  }

  add() {
    console.log(this.pedidoItem);
    this.nav.pop();
  }

  ionViewWillEnter() {
    if (!this.colores) {
      let load = Loading.create({
        content: 'Cargando colores disponibles...',
        duration: 5000,
      });
      this.nav.present(load);
      this.coloresP.getAll()
        .subscribe(res => {
          this.colores = res;
          load.dismiss();
        })
        .catch(error => {
          load.dismiss();
          console.error.bind(error)
        });
    }
  }

  onChanges() {
    if ((this.pedidoItem.color) && (this.pedidoItem.cantidad > 0)) {
      let l: number = this.pedidoItem.perfil.largo / 1000;
      let pxm: number = this.pedidoItem.perfil.pxm;
      let inc: number = this.pedidoItem.color.incremento;
      let c: number = this.pedidoItem.cantidad;
      this.pesoTotal = c * ((pxm * l) + ((pxm * l) * (inc / 100)));
    }
  }
}



