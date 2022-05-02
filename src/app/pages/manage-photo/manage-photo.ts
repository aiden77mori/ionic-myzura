import { Component, ViewChild } from "@angular/core";
import { Location } from '@angular/common';
import { Platform, IonContent, LoadingController, NavController, ModalController } from "@ionic/angular";
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { CameraPreview } from "@ionic-native/camera-preview/ngx";

import { Router } from '@angular/router';
import { FileChooser } from '@ionic-native/file-chooser/ngx';

import { FilePath } from '@ionic-native/file-path/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { LoadingProvider } from 'src/app/services/loading.provider';
import { ImageProvider } from 'src/app/services/image.provider';
import { PhotoLibraryProvider } from 'src/app/services/photo.library.provider';
import { TranslateProvider } from 'src/app/services/translate.service';




@Component({
  selector: 'page-manage-photo',
  templateUrl: 'manage-photo.html',
  styleUrls: ['manage-photo.scss']
})
export class ManagePhotoPage {
  private finalvid: any;
  public myuri: any;
  public myvid: any;
  recording: boolean = false;
  srcPhoto;
  segment = "gallery";
  images = [];
  selectedPhoto = null;

  // selectedPhoto = "https://static.remove.bg/remove-bg-web/f50bd6ad4990ff621deccea155ab762c39d8c77a/assets/start_remove-c851bdf8d3127a24e2d137a55b1b427378cd17385b01aec6e59d5d4b5f39d2ec.png"
  private loading: any;

  @ViewChild(IonContent, { static: false })
  content: IonContent;

  constructor(
    public cameraPreview: CameraPreview,
    public camera: Camera,
    public platform: Platform, 
    private modalCtrl: ModalController,
   
    public translate: TranslateProvider,    
    private loadingProvider: LoadingProvider,
    private loadingCtrl: LoadingController,
    public imageProvider: ImageProvider,
    private fileChooser: FileChooser,
    public filePath: FilePath,
    private base64: Base64,
    private navCtrl: NavController,
    private location : Location,
    private photoLib: PhotoLibraryProvider
  ) {
   }

  ionViewDidLoad(){
    this.openGalleryPicker()
  }
  ionViewDidLeave(){

    console.log("KILLING THE PAGE MANAGE-PHOTO")
   try {
    this.stopCamera();
    this.managePreview(false)

   } catch (error) {
     console.log(error)
   }
  }
  flashMode = "off";

  changeSegment(evt) {
    let value = this.segment;
    console.log('Changing Segment', value)

    if (value == "photo" || value == 'video') {
      this.startCamera();
      this.managePreview(false)

    } else {
      
      this.stopCamera();
      this.managePreview(false)

    }
  }

  flash() {

    if (this.flashMode == 'off') {
      this.flashMode = 'on'
    } else {
      this.flashMode = 'off'
    }
    this.setFlashMode();
  }

  setFlashMode() {
    this.cameraPreview.setFlashMode(this.flashMode).then(() => {

    }).catch(() => {

    });
  }

  takePicture() {

    let self = this;
    if (this.segment === 'video') {
      // if (!this.recording) {
      //   this.recording = true;
      //   let options: CaptureVideoOptions = { limit: 1, duration: 60 };
      //   this.mediaCapture.captureVideo(options)
      //     .then(
      //       (data: MediaFile[]) => {
      //         console.log(data);
      //         this.recording = false;
      //       },
      //       (err: CaptureError) => {
      //         console.error(err)
      //         this.recording = false;
      //       }
      //     );
      // }

    } else {


      const pictureOpts = {
        quality: 60,
        width: 640,
        height: 640,
      };

      this.cameraPreview.takePicture(pictureOpts).then(base64PictureData => {


        self.srcPhoto = "data:image/jpeg;base64," + base64PictureData;
        self.cameraPreview.stopCamera().then(() => {
          this.managePreview(false)

          this.navCtrl.navigateForward('tabs/crop-photo', { state: { src: self.srcPhoto } });
        });

        self.cameraPreview.hide().then(() => {

        });


      });
    }



  }




  async ionViewDidEnter() {
    this.images = [];
    let loading = await this.loadingCtrl.create({
      spinner: 'circles'
    });
    loading.present();
    if(!this.photoLib.hasReadPermission()){
      this.photoLib.requestReadPermission().then(res=>{
        // this.photoLib.fetchImages().then(async (images:any)=>{
        //   this.images = images;
        //   // if(this.images.length==0){
        //   //  this.images = await this.photoLib.getLibrary()
        //   // }
        //   console.log(this.images)
        //   this.selectedPhoto = this.images[0].mediumSizeUrl;
        // })

      })
      // this.photoLib.requestReadPermission()
    }
    // else{
    //   this.photoLib.fetchImages().then(async (images:any)=>{
    //     this.images = images;
    //     console.log(this.images)
       
    //     this.selectedPhoto = this.images[0];
    //   })
    // }

    
    // this.images = await this.photoLib.getLibrary(); 



    if (this.segment === 'photo') {
      this.startCamera();
    }

    loading.dismiss();

  }

  goToPhoto() {
    this.modalCtrl.dismiss()

    this.navCtrl.navigateForward('tabs/crop-photo', { state: { src: this.selectedPhoto } });
  }

  changePhoto(newImage) {

    this.selectedPhoto = newImage;
    this.content.scrollToTop(300);

  }


  back() {
    try {
      // this.startCamera();   
      this.stopCamera();
      this.managePreview(false)

      this.location.back();      
    } catch (e) {
      console.log('error while exiting:', e);
    }

  }

  closeModal(){
    this.modalCtrl.dismiss()
  }

  stopCamera() {
    try {
      this.cameraPreview.stopCamera().catch(e => {
        this.managePreview(false)
  
      });
      this.cameraPreview.hide();
    } catch (e) {
      this.managePreview(false)

      console.log('Error while stopping camera:', e);
    }
  }

  getPosition() {
    return (this.platform.height() / 1.9) - 20
  }

  getHeight() {
    return this.platform.height() - this.getPosition() - 64;
  }




  startCamera() {
    this.stopCamera();
    this.setFlashMode();
    // start camera
    console.log(this.platform.width(), this.platform.height());

    this.cameraPreview.startCamera({
      x: 0,
      y: 44,
      width: this.platform.width(),
      height: this.platform.height(),//this.platform.height()/1.9,
      toBack: true,
      previewDrag: false,
      tapPhoto: true
    }).then(() => {
      this.managePreview(true)
      console.log("camera started")

    }).catch(() => {
      console.log("camera error")
    })

  }

  managePreview(start){
    // let contents =  (window.document.getElementsByTagName('ion-content') as any)
    if(start){
      (window.document.getElementById('page-manage-photo') as HTMLElement).classList.add('preview');
      (window.document.getElementById('page-manage-photo') as HTMLElement).classList.remove('normal-view');  
      // for(var i=0; i<contents.length; i++){
      //   let c = contents[i]
      //   c.classList.remove('normal-view');
      //   c.classList.add('preview');
      // }
    }else{
      (window.document.getElementById('page-manage-photo') as HTMLElement).classList.remove('preview');
      (window.document.getElementById('page-manage-photo') as HTMLElement).classList.add('normal-view');  
      // for(var i=0; i<contents.length; i++){
      //   let c = contents[i]
      //   c.classList.add('normal-view');
      //   c.classList.remove('preview');
      // }
    }
  }

  refresh() {
    this.cameraPreview.switchCamera();
  }

  videotest() {
    this.loadingProvider.show();
    this.fileChooser.open()
      .then((uri) => {
        this.myuri = uri;

        this.filePath.resolveNativePath(this.myuri)
          .then((filePath) => {
            console.log(filePath);
            this.myvid = filePath;
            this.base64.encodeFile(filePath).then((base64File: string) => {
              this.imageProvider.uploadPostvideo(base64File).then((url) => {
                this.finalvid = url;


                this.loadingProvider.hide();
              });

            });

          }, (err) => {
            console.log(err);

          });
      })

  }
  goTovideo() {
    this.stopCamera();
    this.managePreview(false)

    this.navCtrl.navigateForward('tabs/publish', { state: { video: this.finalvid } });    
  }


  openGalleryPicker(){
    
    this.photoLib.openGallery().then(image=>{
      this.changePhoto(image)
    })
  }

}
