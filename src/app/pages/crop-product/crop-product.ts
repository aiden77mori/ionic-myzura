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
import { PhotoLibraryProvider } from "src/app/services/photo.library.provider";
import { FunctionsService } from 'src/app/services/functions.service';
import { AlertProvider } from 'src/app/services/alert.provider';


@Component({
  selector: 'page-crop-product',
  templateUrl: 'crop-product.html',
  styleUrls: ['crop-product.scss']
})
export class CropProductPage implements OnInit {


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
    public functions : FunctionsService,
    private photoLib :  PhotoLibraryProvider,
    private loadingCtrl : LoadingController,    private alertPorvider: AlertProvider,
    public dataProvider: DataProvider, 
    public loadingProvider: LoadingProvider) {
      
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
    // this.alertPorvider.showToast("tHIS MAY TAKE FEW SECONDS")
    // this.loadingProvider.showLoading()
    // alert(1)
    // let url = "assets/test.HEIC"
    // let url =  ""
    // this.functions.getFormat(url).then(res=>{
    //   console.log(res)
    // })
  }

  // NOT WORKING AFTER MODAL CLOSE
  // ionViewDidLoad() {

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


  async done() {
    this.src=this.croppedImage;

    let loading = await this.loadingCtrl.create({
      spinner: 'circles'
    });
    loading.present();

    this.router.navigateByUrl('tabs/crop-product/publish-product', { state: { image: this.src } });
 

    loading.dismiss();
    

  }


  changeSegment(evt: any) {
    const { value } = evt.target;
  }




}
