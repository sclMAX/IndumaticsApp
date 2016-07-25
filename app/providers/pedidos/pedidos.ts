import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs/Observable";
import {Perfil} from '../perfiles/perfiles';
import {Color} from '../colores/colores';
import {Usuario} from '../usuarios/usuarios';

let PouchDB = require('pouchdb');

export class PedidoItem {
  id: number;
  perfil: Perfil;
  cantidad: number;
  color: Color;
  comentario: string;
}

export class Pedido {
  id: string;
  usuario: Usuario;
  fecha: Date;
  items: Array<PedidoItem>;
  isEnviado: boolean = false;
  isPedido: boolean = false;
}

@Injectable()
export class Pedidos {
  private db: any;
  private pedidoActual: Pedido;
  private pedidos: Array<Pedido>;

  constructor(private http: Http) { }

  initDB() {
    this.db = new PouchDB('pedidos', { adapter: 'websql' });
  }

  deleteDB(){
    if(this.db){
      this.db.destroy();
    }
  }

  addItem(item: PedidoItem){
    if(this.pedidoActual){
      this.pedidoActual.items.push(item);
    }
  }


}

