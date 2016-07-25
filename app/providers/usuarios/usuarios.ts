import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';

let PouchDB = require('pouchdb');

export class Usuario {
  id: number = 1;
  razonSocial: string;
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  localidad: string = 'Paraná';
  provincia: string = 'Entre Ríos';
  pais: string = 'Argentina';
}

@Injectable()
export class Usuarios {
  private db: any;
  private usuario: Usuario;

  constructor(private http: Http) { }

  initDB() {
    this.db = new PouchDB('usuarios', { adapter: 'websql' });
  };

  deleteDB() {
    if (this.db) {
      this.db.destroy();
    }
  };

  getUsuario() {
    if (this.usuario) {
      return Observable.create(obs => {
        obs.next(this.usuario);
      });
    } else {
      return Observable.create(obs => {
        if (!this.db) {
          this.initDB();
        };
        this.db.get('1')
          .then(res => {
            this.usuario = res.doc;
            obs.next(this.usuario);
          })
          .catch(error => {
            obs.error(error);
          })
      });
    }
  }

  saveUsuario(u: Usuario) {
    if (!this.db) {
      this.initDB();
    };
    return Observable.create(obs => {
      this.db.get('1').then(res => {
        obs.next(this.db.put({
          _id: '1',
          _rev: res._rev,
          doc: u
        }));
      }).catch(error => {
        obs.next(this.db.put({ doc: u, _id: '1' }));
      })
    });
  }

}

