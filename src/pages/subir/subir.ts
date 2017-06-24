import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';


@Component({
  selector: 'page-subir',
  templateUrl: 'subir.html',
})
export class SubirPage {

  constructor( private viewCtrl: ViewController ) {
  }

  cerrar(){

    this.viewCtrl.dismiss()

  }


}
