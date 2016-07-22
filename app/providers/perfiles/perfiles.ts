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
<<<<<<< HEAD
  idlinea: number;
=======
  idLinea: number;
>>>>>>> 8b450e36a5d7c6e7cf80b5f0805935430e2e0157
}

@Injectable()
export class Perfiles {
  private perfiles: Array<Perfil>;
  private db: any;

  constructor(private http: Http) { };
<<<<<<< HEAD

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
      this.db.put({doc:data[i], _id:data[i].idPerfil});
    };
  }

  update() {
    return Observable.create(observer => {
      this.http.get('http://www.indumatics.com.ar/home/app/models/perfiles.php')
        .map(res => res.json())
        .subscribe(data => {
          this.perfiles = data;
          this.save(this.perfiles);
          observer.next(this.perfiles);
          observer.complete();
        }, error => {
=======

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
>>>>>>> 8b450e36a5d7c6e7cf80b5f0805935430e2e0157
          observer.error(error);
        });
      });
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
            let r: Array<Perfil> = [];
            for (let i = 0; i < res.total_rows; i++) {
              r.push(res.rows[i].doc.doc);
            };
            if (r.length > 0) {
              this.perfiles = r;
              console.log('Perfiles en Perfiles:',this.perfiles)
              observer.next(this.perfiles);
              observer.complete();
            } else {
              this.update()
                .subscribe(data => {
                  observer.next(data);
                  observer.complete();
                }, error => {
                  observer.error(error);
                });
            }
        })
        .catch(error=>{
          observer.error(error);
        });
      });
    }
  }
}

