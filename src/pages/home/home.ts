import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { SubirPage } from '../subir/subir';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  posts: FirebaseListObservable<any[]>;

  constructor(public navCtrl: NavController,
              private modalCtrl: ModalController, 
              private af: AngularFireDatabase) {

    this.posts = af.list('/posts');

  }

  mostrarModal(){

    let modal = this.modalCtrl.create( SubirPage )
    modal.present()

  }

}
