import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';

let PouchDB = require('pouchdb');

export class Linea {
  id: number;
  linea: string;
  descripcion: string;
  encatalogo: boolean;

  constructor() { };
};

@Injectable()
export class Lineas {
  private db: any;
  private lineas: Array<Linea>;

  constructor(private http: Http) { };

  initDB() {
    this.db = new PouchDB('lineas', { adapter: 'websql' });
  };

  deleteDB() {
    if (this.db) {
      this.db.destroy();
    }
  };

  save(data: Array<Linea>) {
    if (!this.db) {
      this.initDB();
    }
    for (let i = 0; i < data.length; i++) {
      this.db.put({ doc: data[i], _id: data[i].id });
    };
  };

  update() {
    return Observable.create(observer => {
      this.http.get('http://www.indumatics.com.ar/home/app/models/lineas.php')
        .map(res => res.json())
        .subscribe(data => {
          this.lineas = data;
          this.save(this.lineas);
          observer.next(this.lineas);
        }, error => {
          observer.error(error);
        });
    });
  };

  getAll() {
    if (!this.db) {
      this.initDB();
    }
    if (this.lineas) {
      return Observable.create(observer => {
        observer.next(this.lineas);
      })
    } else {
      return Observable.create(observer => {
        this.db.allDocs({ include_docs: true })
          .then(res => {
            let r: Array<Linea> = [];
            for (let i = 0; i < res.total_rows; i++) {
              r.push(res.rows[i].doc.doc);
            };
            if (r.length > 0) {
              this.lineas = r;
              observer.next(this.lineas);
            } else {
              this.update()
                .subscribe(data => {
                  observer.next(data);
                }, error => {
                  observer.error(error);
                });
            }
          })
          .catch(error => {
            observer.error(error);
          });
      });
    }
  };
}

