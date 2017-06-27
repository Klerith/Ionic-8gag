import { Component } from '@angular/core';
import { ViewController, ToastController, Platform } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';


// Plugins
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';

// Servicios
import { CargaArchivosService } from './../../providers/carga-archivos/carga-archivos';


@Component({
  selector: 'page-subir',
  templateUrl: 'subir.html',
})
export class SubirPage {

  titulo: string = ''

  imgPreview: string = null

  img: string = ""

  constructor( private viewCtrl: ViewController,
               private toastCtrl: ToastController,
               private loadingCtrl: LoadingController,
               private platform: Platform,
               private imagePicker: ImagePicker,
               private camera: Camera,
               private _cas: CargaArchivosService ) {
  }

  crearPost(){

    let archivo = {
      'titulo': this.titulo,
      'img': this.img
    }

    let loader = this.loadingCtrl.create({
      content: "Subiendo...",
    });
    loader.present();

    this._cas.cargarImagenesFireBase(archivo).then(
      ()=>{

        loader.dismiss()
        this.cerrar()

      },
      ( err ) =>{

        loader.dismiss()

        this.mostrarToast('Error al cargar' + err)

        console.error('Error al cargar', JSON.stringify(err))

      }
    ) 

    console.log("Subiendo imagen.")

  }

  cerrar(){

    this.viewCtrl.dismiss()

  }

  abrirCamara(){

    if ( !this.platform.is('cordova')){
      this.mostrarToast('Estamos en el compu')
      return
    }

    const options: CameraOptions = {
      quality: 40,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.imgPreview = 'data:image/jpeg;base64,' + imageData;
      this.img = imageData

    }, (err) => {

      console.error('Error en la camara' , err)
      
      this.mostrarToast('Error en la camara' + err)

      // Handle error
      });
  }

  SeleccionarFoto(){

    if ( !this.platform.is('cordova')){
      this.mostrarToast('Estamos en el compu')
      return
    }

    let options: ImagePickerOptions = {
      maximumImagesCount: 1,
      quality: 40,
      outputType: 1

    }

    this.imagePicker.getPictures(options).then((results) => {

      for ( let img of results ){

        console.log( 'Imagen seleccionada: ', img )

        this.imgPreview = 'data:image/jpeg;base64,' + img;
        this.img = img
        break

      }
      
    }, (err) => { 

      console.error('Error en la seleccion: ' , err)
      
      this.mostrarToast('Error en la seleccion: ' + JSON.stringify(err))
    });

  }

  private mostrarToast( texto: string){

    this.toastCtrl.create({
      message: texto,
      duration: 2500
    }).present()

  }


}
