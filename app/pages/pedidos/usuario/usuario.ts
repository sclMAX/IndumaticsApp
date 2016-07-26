import { Component } from '@angular/core';
import { NavController, NavParams, Toast, Loading} from 'ionic-angular';
import {Usuarios, Usuario} from '../../../providers/usuarios/usuarios';
import {HomePage} from '../../home/home';
import {PedidosPage} from '../pedidos';
import {FormBuilder, ControlGroup, Validators} from '@angular/common';

@Component({
  templateUrl: 'build/pages/pedidos/usuario/usuario.html',
  providers: [Usuarios]
})
export class UsuarioPage {

  usuarioForm: ControlGroup;
  title: string;
  usuario: Usuario;

  constructor(private nav: NavController, private formBuilder: FormBuilder,
    private usuariosP: Usuarios) {
    this.title = "Datos de contacto";
    this.usuario = new Usuario();
    this.usuarioForm = this.createForm();
  }

  saveUsuario() {
    let t = Toast.create({
      duration: 2000,
      position: 'middle'
    });
    this.usuariosP.saveUsuario(this.usuario)
      .subscribe(res => {
        this.nav.pop(this);
        t.setMessage('Datos de contacto guardados correctamente.');
        this.nav.present(t);
      }, error => {
        t.setMessage('No se pudo guardar los datos de contacto, intente nuevamente!');
        this.nav.present(t);
      });
  }

  ionViewWillEnter() {
    let load = Loading.create({
      content: 'Buscando pedidos sin enviar...',
      duration: 3000
    });
    this.nav.present(load);
    this.usuariosP.getUsuario()
      .subscribe(res => {
        this.usuario = res;
        load.dismiss();
      },
      error => {
        load.dismiss();
      });
  }

  private createForm() {
    return this.formBuilder.group({
      nombre: ['', Validators.required],
      telefono: ['', Validators.required && Validators.minLength(8)],
      email: ['', Validators.required && Validators.minLength(10)],
      direccion: ['', Validators.required && Validators.minLength(6)],
      localidad: ['', Validators.required && Validators.minLength(4)],
      provincia: ['', Validators.required && Validators.minLength(5)],
      pais: ['', Validators.required && Validators.minLength(5)],
    });
  }

}