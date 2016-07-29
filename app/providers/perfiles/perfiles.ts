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
  idlinea: number;
  idLinea: number;
}

export class PerfilesList {
  fua: Date;
  perfiles: Array<Perfil>;
}

@Injectable()
export class Perfiles {
  private db: any;
  private perfiles: PerfilesList;

  constructor(private http: Http) { };

  initDB() {
    this.db = new PouchDB('perfiles', { adapter: 'websql' });
  }

  deleteDB() {
    if (this.db) {
      this.db.destroy();
      this.initDB();
    }
  }

  save(data: PerfilesList, isUpdate: boolean = false) {
    if (!this.db) {
      this.initDB();
    };
    if (isUpdate) { this.deleteDB() };
    this.db.put({ doc: data, _id: '1' });
  }

  update(isUpdate: boolean = false) {
    return Observable.create(observer => {
      this.http.get('http://www.indumatics.com.ar/home/app/models/perfiles.php')
        .map(res => res.json())
        .subscribe(data => {
          console.log('Nueva Descarga HTTP!', this);
          if (!this.perfiles) { this.perfiles = new PerfilesList() };
          this.perfiles.perfiles = <Array<Perfil>>JSON.parse(JSON.stringify(data.data));
          this.save(this.perfiles, isUpdate);
          observer.next(this.perfiles);
        }, error => {
        });
    });
  }

  getAll() {
    if (!this.db) {
      this.initDB();
    }
    if (this.perfiles) {
      return Observable.create(observer => {
        observer.next(this.perfiles);
      });
    } else {
      return Observable.create(observer => {
        this.db.get('1')
          .then(res => {
            this.perfiles = <PerfilesList>JSON.parse(JSON.stringify(res.doc));
            observer.next(this.perfiles);
          })
          .catch(error => {
            this.update()
              .subscribe(data => {
                observer.next(data);
              }, error => {
                observer.error(error);
              });
          });
      });
    }
  }
}

