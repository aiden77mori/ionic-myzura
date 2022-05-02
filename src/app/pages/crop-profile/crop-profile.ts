import { Component, ViewChild, OnInit,NgZone } from '@angular/core';
import { IonContent, LoadingController, NavController } from '@ionic/angular';
import { FilterService } from "../../util/filterservice";

import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DataProvider } from 'src/app/services/data.provider';
import { LoadingProvider } from 'src/app/services/loading.provider';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { TranslateProvider } from 'src/app/services/translate.service';
import { ImageProvider } from 'src/app/services/image.provider';


@Component({
  selector: 'page-crop-profile',
  templateUrl: 'crop-profile.html',
  styleUrls: ['crop-profile.scss']
})
export class CropProfilePage implements OnInit {


  src: string;
  user: any;
  image: HTMLImageElement;

  croppedImage: any = '';
  cropWidth=1080;
  cropHeight=1080;
  cropradio=1; 

  constructor(
    private router: Router, public navCtrl: NavController,
    public translate: TranslateProvider,
    public imageProvider: ImageProvider,
    private loadingCtrl : LoadingController,    private ngZone: NgZone,
    public dataProvider: DataProvider, public loadingProvider: LoadingProvider) {
  }


  back() {


      this.navCtrl.back();



  }

  async ngOnInit() {
    const state: any = (window as any).history.state;
    let { src } = state;
    let { user } = state;
    this.src = src;
    this.user = user;
  }

  ionViewWillEnter() {
    // this.dataProvider.getCurrentUser().subscribe((user) => {
    //   this.user = <any>user;
    // });
  }

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


  async done() {
    this.src=this.croppedImage;

    let loading = await this.loadingCtrl.create({
      spinner: 'circles'
    });
    loading.present();
    this.imageProvider.setProfilePhoto(this.user, this.src)
    //BEFORE PASSING CROP REDUCE THE PHOTO!!!
    this.navCtrl.navigateRoot('tabs/profile');

    loading.dismiss();
    

  }


  changeSegment(evt: any) {
    const { value } = evt.target;
  }




}
