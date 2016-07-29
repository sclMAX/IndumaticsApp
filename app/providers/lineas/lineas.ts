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
};

export class LineasList {
  fua: Date;
  lineas: Array<Linea>;
}

@Injectable()
export class Lineas {
  private db: any;
  private lineas: LineasList;

  constructor(private http: Http) { };

  initDB() {
    this.db = new PouchDB('lineas', { adapter: 'websql' });
  };

  deleteDB() {
    if (this.db) {
      this.db.destroy();
      this.initDB();
    }
  };

  save(data: LineasList, isUpdate: boolean = false) {
    if (!this.db) {
      this.initDB();
    }
    if (isUpdate) { this.deleteDB(); };
    this.db.put({ doc: data, _id: '1' });
  };

  update(isUpdate: boolean = false) {
    return Observable.create(observer => {
      this.http.get('http://www.indumatics.com.ar/home/app/models/lineas.php')
        .map(res => res.json())
        .subscribe(data => {
          console.log('Nueva Descarga HTTP!', this);
          if (!this.lineas) { this.lineas = new LineasList() };
          this.lineas.lineas = <Array<Linea>>JSON.parse(JSON.stringify(data.data));
          this.lineas.fua = new Date();
          this.save(this.lineas, isUpdate);
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
        this.db.get('1')
          .then(res => {
            this.lineas = <LineasList>JSON.parse(JSON.stringify(res.doc));
            observer.next(this.lineas);
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
  };
}

