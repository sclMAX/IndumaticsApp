import { Component } from '@angular/core';
import { NavController, NavParams, Toast } from 'ionic-angular';
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
    private usuariosP: Usuarios, private parametros: NavParams) {
    this.title = "Datos de contacto";
    this.usuario = this.parametros.get('usuario');
    if (!this.usuario) { this.usuario = new Usuario() };
    this.usuarioForm = this.createForm();
  }

  saveUsuario() {
    this.usuariosP.saveUsuario(this.usuario)
      .subscribe(res => {        
        this.nav.pop(this);
        let t = Toast.create({
          message: 'Datos de contacto guardados correctamente.',
          duration: 3000,
          position: 'middle'
        });
        this.nav.present(t);
      }, error => {
        let t = Toast.create({
          message: 'No se pudo guardar los datos de contacto, intente nuevamente!',
          duration: 3000,
          position: 'middle'
        });
        this.nav.present(t);
      });
  }

  private createForm() {
    return this.formBuilder.group({
      nombre: ['', Validators.required],
      telefono: ['', Validators.required && Validators.minLength(8)],
      email: ['', Validators.required && Validators.minLength(10)],
      direccion: ['', Validators.required && Validators.minLength (6)],
      localidad: ['', Validators.required && Validators.minLength (4)],
      provincia: ['', Validators.required && Validators.minLength (5)],
      pais: ['', Validators.required && Validators.minLength (5)],
    });
  }

}