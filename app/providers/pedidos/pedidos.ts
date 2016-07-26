import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
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
  items: Array<PedidoItem> = [];
  isEnviado: boolean = false;
  isPedido: boolean = false;
}

@Injectable()
export class Pedidos {
  private db: any;
  private pedido: Pedido;
  private pedidos: Array<Pedido>;

  constructor(private http: Http) { }

  initDB() {
    this.db = new PouchDB('pedidos', { adapter: 'websql' });
  };

  deleteDB() {
    if (this.db) {
      this.db.destroy();
    }
  };

  save(p: Pedido) {
    if (!this.db) {
      this.initDB();
    };
    return Observable.create(obs => {
      if (!p.isEnviado) {
        this.db.get('1').then(res => {
          obs.next(this.db.put({
            _id: '1',
            _rev: res._rev,
            doc: p
          }));
        }).catch(error => {
          obs.next(this.db.put({ doc: p, _id: '1' }));
        });
      } else {
        obs.error('Pedido ya enviado!');
      }
    });
  };

  getPedido() {
    if (this.pedido) {
      return Observable.create(obs => {
        obs.next(this.pedido);
      });
    } else {
      return Observable.create(obs => {
        if (!this.db) {
          this.initDB();
        };
        this.db.get('1')
          .then(res => {
            this.pedido = res.doc;
            obs.next(this.pedido);
          })
          .catch(error => {
            this.pedido = new Pedido();
            obs.next(this.pedido);
          })
      });
    }
  };
}

