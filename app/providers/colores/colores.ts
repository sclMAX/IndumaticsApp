import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';

let PouchDB = require('pouchdb');

export class Color {
  id: number;
  color: string;
  incremento: number;
}

@Injectable()
export class Colores {
  private db: any;
  private colores: Array<Color>;

  constructor(private http: Http) { };

  initDB() {
    this.db = new PouchDB('colores', { adapter: 'websql' });
  };

  deleteDB() {
    if (this.db) {
      this.db.destroy();
    }
  };

  save(data: Array<Color>) {
    if (!this.db) {
      this.initDB();
    }
    for (let i = 0; i < data.length; i++) {
      this.db.put({ doc: data[i], _id: data[i].id });
    };
  };

  update() {
    return Observable.create(observer => {
      this.http.get('http://www.indumatics.com.ar/home/app/models/colores.php')
        .map(res => res.json())
        .subscribe(data => {
          console.log('Nueva Descarga HTTP!');
          this.colores = <Array<Color>>JSON.parse(JSON.stringify(data.data));
          this.save(this.colores);
          observer.next(this.colores);
        }, error => {
          observer.error(error);
        });
    });
  };

  getAll() {
    if (!this.db) {
      this.initDB();
    }
    if (this.colores) {
      return Observable.create(observer => {
        observer.next(this.colores);
      });
    } else {
      return Observable.create(observer => {
        this.db.allDocs({ include_docs: true })
          .then(res => {
            let r: Array<Color> = [];
            for (let i = 0; i < res.total_rows; i++) {
              r.push(res.rows[i].doc.doc);
            };
            if (r.length > 0) {
              this.colores = <Array<Color>>JSON.parse(JSON.stringify(r));
              observer.next(this.colores);
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

