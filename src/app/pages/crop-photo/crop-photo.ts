import { Component, ViewChild, OnInit,NgZone } from '@angular/core';
import { IonContent, LoadingController, NavController } from '@ionic/angular';
import { FilterService } from "../../util/filterservice";

import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DataProvider } from 'src/app/services/data.provider';
import { LoadingProvider } from 'src/app/services/loading.provider';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { TranslateProvider } from 'src/app/services/translate.service';
import { PhotoLibraryProvider } from 'src/app/services/photo.library.provider';


@Component({
  selector: 'page-crop-photo',
  templateUrl: 'crop-photo.html',
  styleUrls: ['crop-photo.scss']
})
export class CropPhotoPage implements OnInit {


  src: string;
  user: any;
  image: any;

  croppedImage: any = '';
  cropWidth=1080;
  cropHeight=1080;
  cropradio=1; 

  constructor(
    private router: Router, public navCtrl: NavController,
    public translate: TranslateProvider,
    private photoLib : PhotoLibraryProvider,
    private loadingCtrl : LoadingController,    private ngZone: NgZone,
    public dataProvider: DataProvider, public loadingProvider: LoadingProvider) {
  }


  back() {


      this.navCtrl.back();



  }
  getImageGallery(){
    this.photoLib.openGallery().then(async image=>{
      this.image = image;
    })
  }
  ionViewWillEnter(){
    console.log("ionViewWillEnter")
    this.image = ""
    this.getImageGallery()  

  }
  async ngOnInit() {
 
    // this.getImageGallery()  
  }

  // ionViewWillEnter() {
  //   const state: any = (window as any).history.state;
  //   let { image } = state;

  //   console.log(image)
  //   this.src = image;
  //   // this.dataProvider.getCurrentUser().subscribe((user) => {
  //   //   this.user = <any>user;
  //   // });
  // }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
 }

 crop_square_image(){
   this.cropradio=1;
  // this.ngZone.run(() => {
  //   this.cropradio="1 / 1"; 
  //   this.cropWidth=1080;
  //   this.cropHeight=1080;
  // });
 }

 crop_portrait_image(){
  this.cropradio=2;
    // this.cropradio="3 / 4"; 
    // this.cropWidth=1080;
    // this.cropHeight=1350;

 }


  async next() {
    this.src=this.croppedImage;


    //BEFORE PASSING CROP REDUCE THE PHOTO!!!
    // this.navCtrl.navigateForward('tabs/show-photo', { state: { src: this.src } });
    this.router.navigateByUrl('tabs/publish', { state: { image: this.src } });
    

  }


  changeSegment(evt: any) {
    const { value } = evt.target;
  }




}
