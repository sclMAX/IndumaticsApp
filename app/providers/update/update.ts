import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
export class UpdateData {
  msg: string = '';
  fecha: Date;
}
@Injectable()
export class Update {
  private updateData: UpdateData;

  constructor(private http: Http) { }

  checkUpdate() {
    if (this.updateData) {
      return Observable.create(obs => {
        obs.next(this.updateData);
      })
    } else {
      return Observable.create(observer => {
        this.http.get('http://www.indumatics.com.ar/home/app/models/update.php')
          .map(res => res.json())
          .subscribe(data => {
            console.log('Nueva Descarga HTTP!', this);
            if (data) {
              if (!this.updateData) { this.updateData = new UpdateData() };
              this.updateData.msg = <string>JSON.parse(JSON.stringify(data.msg));
              this.updateData.fecha = new Date(<string>JSON.parse(JSON.stringify(data.fecha.date)));
              observer.next(this.updateData);
            } else {
              observer.error('Sin Datos!');
            }
          }, error => {
          });
      });
    }
  }
}

