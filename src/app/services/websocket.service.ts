import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Usuario } from '../classes/usuario';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public socketStatus = false
  public usuario: Usuario = null

  constructor(
    private socket: Socket, //servicio inyectado
    private router: Router
  ) {
    this.cargarStorage()
    this.checkStatus()
  }

  checkStatus() {
    this.socket.on('connect', () => {
      console.log('Conectado al SERVER')
      this.socketStatus = true;
      this.cargarStorage()
    })

    this.socket.on('disconnect', () => {
      console.log('Desconectado al SERVER')
      this.socketStatus = false;
    })
  }

  emit(evento: string, payload?: any, callback?: Function) {  //emit(evento,payload, callback)
    console.log('EMITIENDO: ', evento)
    this.socket.emit(evento, payload, callback) //disparar un EVENTO a 01-SERVER
  }

  // Escuche cualquier evento
  listen(evento: string) {
    return this.socket.fromEvent(evento)

  }

  loginWS(nombre: string) {

    return new Promise((resolve, reject) => {

      this.emit('configurar-usuario', { nombre }, resp => {

        console.log(resp)

        this.usuario = new Usuario(nombre)

        this.guardarStorage()

        resolve()

      })

    })

  }

  logoutWS() {

    this.usuario = null
    localStorage.removeItem('usuario')

    const payload = {
      nombre: 'sin-nombre'
    }

    this.emit('configurar-usuario', payload, () => { })
    this.router.navigateByUrl('')

  }



  getUsuario() {
    return this.usuario
  }

  guardarStorage() {
    localStorage.setItem('usuario', JSON.stringify(this.usuario))  //convertir en STRING
  }

  cargarStorage() {
    if (localStorage.getItem('usuario')) {
      this.usuario = JSON.parse(localStorage.getItem('usuario'))
      this.loginWS(this.usuario.nombre)
    }

  }

}
