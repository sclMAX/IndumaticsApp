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

export class ColorList {
  fua: Date;
  colores: Array<Color>;
};

@Injectable()
export class Colores {
  private db: any;
  private colores: ColorList;

  constructor(private http: Http) { };

  initDB() {
    this.db = new PouchDB('colores', { adapter: 'websql' });
  };

  deleteDB() {
    if (this.db) {
      this.db.destroy();
      this.initDB();
    }
  };

  save(data: ColorList, isUpdate: boolean = false) {
    if (!this.db) {
      this.initDB();
    }
    if (isUpdate) { this.deleteDB(); }
    this.db.put({ doc: data, _id: '1' });
  };

  update(isUpdate: boolean = false) {
    return Observable.create(observer => {
      this.http.get('http://www.indumatics.com.ar/home/app/models/colores.php')
        .map(res => res.json())
        .subscribe(data => {
          console.log('Nueva Descarga HTTP!', this);
          if (!this.colores) { this.colores = new ColorList(); };
          this.colores.colores = <Array<Color>>JSON.parse(JSON.stringify(data.data));
          this.colores.fua = new Date();
          this.save(this.colores, isUpdate);
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
        this.db.get('1')
          .then(res => {
            this.colores = <ColorList>JSON.parse(JSON.stringify(res.doc));
            observer.next(this.colores);
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

