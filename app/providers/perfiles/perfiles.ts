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

@Injectable()
export class Perfiles {
  private db: any;
  private perfiles: Array<Perfil>;

  constructor(private http: Http) { };

  initDB() {
    this.db = new PouchDB('perfiles', { adapter: 'websql' });
  }

  deleteDB() {
    if (this.db) {
      this.db.destroy();
    }
  }

  save(data: Array<Perfil>) {
    if (!this.db) {
      this.initDB();
    }
    for (let i = 0; i < data.length; i++) {
      this.db.put({ doc: data[i], _id: data[i].idPerfil });
    };
  }

  update() {
    return Observable.create(observer => {
      this.http.get('http://www.indumatics.com.ar/home/app/models/perfiles.php')
        .map(res => res.json())
        .subscribe(data => {
          console.log('Nueva Descarga HTTP!',this);
          this.perfiles = <Array<Perfil>>JSON.parse(JSON.stringify(data.data));
          this.save(this.perfiles);
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
        this.db.allDocs({ include_docs: true })
          .then(res => {
            let r: Array<Perfil> = [];
            for (let i = 0; i < res.total_rows; i++) {
              r.push(res.rows[i].doc.doc);
            };
            if (r.length > 0) {
              this.perfiles = <Array<Perfil>>JSON.parse(JSON.stringify(r));
              observer.next(this.perfiles);
            } else {
              this.update()
                .subscribe(data => {
                  observer.next(data);
                }, error => {
                  observer.error(error);
                });
            };
          })
          .catch(error => {
            observer.error(error);
          });
      });
    }
  }
}

