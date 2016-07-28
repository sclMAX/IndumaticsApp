import { Component, Pipe} from '@angular/core';
import { NavController, NavParams, Loading, Toast} from 'ionic-angular';
import {Perfil} from '../../../providers/perfiles/perfiles';
import {Color, Colores, ColorList} from '../../../providers/colores/colores';
import {PedidoItem, Pedido, Pedidos} from '../../../providers/pedidos/pedidos';
import {FormBuilder, ControlGroup, Validators} from '@angular/common';

@Component({
  templateUrl: 'build/pages/pedidos/pedidos-add/pedidos-add.html',
  providers: [Colores, Pedidos],
})
export class PedidosAddPage {

  addForm: ControlGroup;
  title: string;
  perfil: Perfil;
  colores: Array<Color>;
  pedidoItem: PedidoItem;
  pesoTotal: number;
  private pedido: Pedido;

  constructor(private nav: NavController, private parametros: NavParams,
    private coloresP: Colores, private formBuilder: FormBuilder,
    private pedidosP: Pedidos) {
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
    if (this.pedido) {
      if (this.pedido.items) {
        this.pedido.items.push(this.pedidoItem);
      }
      let t = Toast.create({
        duration: 3000
      });
      this.pedidosP.save(this.pedido)
        .subscribe(res => {
          this.nav.pop();
          t.setMessage('Item agregado correctamente al pedido!');
          this.nav.present(t);
        }, error => {
          this.pedido.items.pop();
          t.setMessage('Error al intentar agraar el item al pedido!');
          this.nav.present(t);
        });
    } else {
      console.log('no HAY PEDIDO')
    }
  }

  ionViewWillEnter() {
    if (!this.pedido) {
      let load = Loading.create({
        content: 'Buscando pedidos sin enviar...',
        duration: 5000
      });
      this.nav.present(load);
      this.pedidosP.getPedido()
        .subscribe(res => {
          this.pedido = res;
          load.dismiss();
          if (!this.colores) {
            load.setContent('Cargando colores disponibles...');
            this.nav.present(load);
            this.coloresP.getAll()
              .subscribe(res => {
                this.colores = res.colores;
                load.dismiss();
              }, error => {
                load.dismiss();
                console.error.bind(error)
              });
          };
        },
        error => {
          load.dismiss();
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



