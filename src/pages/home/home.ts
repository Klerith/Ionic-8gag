import { Component } from '@angular/core';
import { NavController, ModalController, ToastController, Platform } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { SubirPage } from '../subir/subir';

// Servicios.
import { CargaArchivosService } from './../../providers/carga-archivos/carga-archivos';

import { AngularFireAuth } from 'angularfire2/auth'
import * as firebase from 'firebase/app';

// Facebook
import { Facebook } from '@ionic-native/facebook';

import { SocialSharing } from '@ionic-native/social-sharing';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  hayMas: boolean = true

  displayName: string = null

  constructor(public navCtrl: NavController,
              private modalCtrl: ModalController,
              private _cas: CargaArchivosService,
              private afAuth: AngularFireAuth,
              private fb: Facebook, 
              private platform: Platform,
              private socialSharing: SocialSharing,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              ) {
 
    this._cas.cargarImagenes();

    afAuth.authState.subscribe(user => {
      if (!user) {
        this.displayName = null;   
        return;
      }
      this.displayName = user.displayName;   
      console.log(this.displayName)   
    });

  }

  ingresar() {
    if (this.platform.is('cordova')) {
      return this.fb.login(['email', 'public_profile']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        return firebase.auth().signInWithCredential(facebookCredential);
      })
    }
    else {
      return this.afAuth.auth
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(res => console.log(res));
    }
  }

  salir() {
    this.afAuth.auth.signOut();
  }

  cargarPostSiguientes( infiniteScroll: any ){

    console.log('cargarPostSiguientes')

    this._cas.cargarImagenes()
          .then( ( existenMas: boolean ) => {
            
            console.log(existenMas)

            this.hayMas = existenMas
            
            infiniteScroll.complete();
          } );

  }

  compartirPost( post: any ){

    console.log('Mensaje: ' + post.titulo)
    console.log('image: ' + post.img)

    if ( !this.platform.is('cordova')){
      this.mostrarToast('Estamos en el compu')
      return
    }

    let loader = this.loadingCtrl.create({
      content: "Subiendo tu post...",
    }); 
    loader.present();

    // Check if sharing via email is supported
    this.socialSharing.shareViaFacebook(post.titulo, post.img, "null" ).then(( success ) => {
      // Sharing via email is possible
      loader.dismiss()  
      this.mostrarToast('Muy okey, ya esta tu post' + success)
      console.log('Post creado: ' + success )

    }).catch(( error ) => {
      // Sharing via email is not possible
        loader.dismiss()

        this.mostrarToast('Error al cargar' + error)

        console.error('Error al cargar'+ JSON.stringify(error))
    });



  

  }

  mostrarModal(){

    let modal = this.modalCtrl.create( SubirPage )
    modal.present()
  }

  private mostrarToast( texto: string){

    this.toastCtrl.create({
      message: texto,
      duration: 2500
    }).present()

  }

}
