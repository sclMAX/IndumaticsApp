import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';

let PouchDB = require('pouchdb');

export class Perfil {
  idPerfil: string;
  descripcion: string;
  largo: number;
  pxm: number;
  bxp: number;
  idLinea: number;
}

@Injectable()
export class Perfiles {
  private perfiles: Array<Perfil>;
  private db: any;

  constructor(private http: Http) { };

  initDB() {
    this.db = new PouchDB('perfiles', { adapter: 'websql' });
  }

  deleteDB() {
    if (this.db) {
      this.db.destroy();
    }
  }

  getAll() {
    if (!this.db) {
      this.initDB();
    }
    if (this.perfiles) {
      return Observable.create(observer => {
        observer.next(this.perfiles);
        observer.complete();
      })
    } else {
      return Observable.create(observer => {
        this.db.allDocs({ include_docs: true })
        .then(res =>{
            
        })
        .catch(error=>{
          observer.error(error);
        });
      });
    }
  }
}

