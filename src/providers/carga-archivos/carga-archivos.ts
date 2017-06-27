import { Injectable } from '@angular/core';

import { ToastController } from 'ionic-angular';

import { AngularFireModule } from 'angularfire2'

import { AngularFireDatabase } from 'angularfire2/database';

import * as firebase from 'firebase';

@Injectable()
export class CargaArchivosService {

  private CARPETA_IMAGENES: string = 'img'
  private POSTS: string = 'posts'
  
  imagenes: any[] = []
  lastKey: string = undefined

  constructor( public af: AngularFireModule,
               private toastCtrl: ToastController,
               private afDB: AngularFireDatabase) {
  }

  cargarImagenes() {

    return new Promise( ( resolve, reject ) => {

        this.afDB.list("/posts",{

          query:{
            limitToLast: 4,
            orderByKey: true,
            endAt: this.lastKey
          }
        }).subscribe( posts => {
          
          if ( this.lastKey ){
            posts.pop()
          }

          if ( posts.length == 0 ){
            console.log('Ya no existen mas registros.')
            resolve(false)
            return
          }

          this.lastKey = posts[0].$key
          
          for ( let i = posts.length - 1; i >=0; i--){
            let post = posts[i]
            this.imagenes.push( post )
          }
          resolve(true)
        })
    } )
  }              

  cargarImagenesFireBase( archivo: archivoSubir ){

    let promesa = new Promise( (resolve, reject) => {

      this.mostrarToast('Inicio de carga')

      let storageRef = firebase.storage().ref()
      let nombreArchivo = new Date().valueOf()
      console.log('nombreArchivo: ' + nombreArchivo)

      let uploadTask:firebase.storage.UploadTask =
              storageRef.child(`${ this.CARPETA_IMAGENES  }/${ nombreArchivo }`)
              .putString( archivo.img, 'base64', { contentType: 'image/jpeg' }  );
                                                 
      uploadTask.on( firebase.storage.TaskEvent.STATE_CHANGED, 

          ( snapshot ) => {}, // El avance del archivo.
          ( error ) => { // Manejo de errores.

            console.error("Error al subir ", JSON.stringify(error))
            this.mostrarToast("Error al subir " + JSON.stringify(error))
            reject(error)

          }, 
          () => { // Termino de proceso.
            let url = uploadTask.snapshot.downloadURL;
            this.mostrarToast("Imagen cargada exitosamente!!");
            this.crear_post( archivo.titulo, url );
            resolve();
          }
      )
    })
    return promesa
  }

  private crear_post(titulo: string, url: string){

    let post: archivoSubir = {
      img: url,
      titulo: titulo
    }
    let $key = this.afDB.list(`/${ this.POSTS }`).push( post ).key;
    post.$key = $key

    this.imagenes.push( post )
  }
  
  private mostrarToast( texto: string){

    this.toastCtrl.create({
      message: texto,
      duration: 2500
    }).present()
  }
}

interface archivoSubir {
  $key?: string
  img: string
  titulo: string
}
