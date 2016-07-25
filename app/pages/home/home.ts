import {Component} from '@angular/core';
import {NavController, Loading} from 'ionic-angular';
import {CatalogoLineasPage} from '../catalogo/catalogo-lineas/catalogo-lineas';
import {ContactoPage} from '../contacto/contacto';
import {PedidosPage} from '../pedidos/pedidos';
import {UsuarioPage} from '../pedidos/usuario/usuario';
import {Usuarios, Usuario} from '../../providers/usuarios/usuarios';

@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: [Usuarios],
})

export class HomePage {

  title: string;
  private usuario: Usuario;

  constructor(private nav: NavController, private usuariosP: Usuarios) {
    this.title = 'INDUMATICS S.A.';
  }

  goCatalogo() {
    this.nav.push(CatalogoLineasPage);
  }

  goContacto() {
    this.nav.push(ContactoPage);
  }

  goPedidos() {
    let load = Loading.create({
      content: 'Buscando Usuario...',
      duration: 3000
    });
    if (this.usuario) {
      this.nav.push(PedidosPage, { usuario: this.usuario });
    } else {
      this.nav.present(load);
      this.usuariosP.getUsuario()
        .subscribe(res => {
          if (res) {
            this.usuario = res;
            load.dismiss();
            this.nav.push(PedidosPage, { usuario: this.usuario });
          } else {
            load.dismiss();
            this.nav.push(UsuarioPage);
          };
        },
        error => {
          load.dismiss();
          this.nav.push(UsuarioPage);
        });
    }
  }
}
