import { Component, ViewChild } from "@angular/core";
import { Platform, IonContent, LoadingController } from "@ionic/angular";
import { Camera } from '@ionic-native/camera/ngx';
import { CameraPreview } from "@ionic-native/camera-preview/ngx";
import { ImageService } from "../../util/imageservice";
import { UnsplashItUtil } from "../../util/unsplashItutil";

import { CanvasDraw } from 'src/app/components/photo/canvasdraw';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { LoadingProvider } from 'src/app/services/loading.provider';
import { DataProvider } from 'src/app/services/data.provider';
import { ImageProvider } from 'src/app/services/image.provider';
import { PhotoLibraryProvider } from 'src/app/services/photo.library.provider';
import { StoryService } from 'src/app/services/story.service';

@Component({
  selector: 'page-add-story',
  templateUrl: 'add-story.html',
  styleUrls: ['add-story.scss']
})
export class AddStoryPage {

  recording: boolean = false;
  srcPhoto;
  segment = "gallery";
  images = [];
  selectedPhoto;
  selectedPhotoMedium;
  tabBarElement: any;


  @ViewChild(IonContent, { static: true }) content: IonContent;

  @ViewChild('myCanvasDraw', { static: false })
  canvas: CanvasDraw;

  constructor(
    public cameraPreview: CameraPreview,
    public camera: Camera,
    public platform: Platform,    
    private dataProvider: DataProvider,
    private storyService: StoryService,
    private imageProvider: ImageProvider,    
    private router: Router,
    private location: Location,
    private webView : WebView,
    private loadingCtrl: LoadingController,
    private photoL: PhotoLibraryProvider

  ) {

    let self = this;
    // this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    // let photo: any = document.querySelector('.scroll-content');
    // photo.style.backgroundColor = 'transparent';
  }

  flashMode = "off";
  user: any;

  changeSegment(evt) {
    let value = this.segment;
    console.log('Changing Segment', value)

    if (value == "photo" || value == 'video') {
      this.startCamera();
    } else {
      this.stopCamera();
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


        this.router.navigateByUrl('tabs/show-photo', { state: { src: self.srcPhoto, story: true } });
        self.cameraPreview.hide().then(() => {

        })


      });
    }
  }



  async ionViewDidEnter() {    
    let loading = await this.loadingCtrl.create({
      spinner: 'circles'
    });
    loading.present();
    this.cameraPreview.stopCamera();
    this.cameraPreview.hide();    
    this.dataProvider.getCurrentUser().subscribe((user) => {
      this.user = <any>user;
    });
    
    this.images = [];    
    // this.images = await this.photoL.loadMultipleImageFromGallery();
    loading.dismiss();    
    
    this.selectedPhotoMedium = this.images[0].mediumSizeUrl;
    this.selectedPhoto = this.images[0].mediumSizeUrl;

    if (this.segment == 'photo') {
      this.startCamera();
    }

  }


  async share() {
    let loading = await this.loadingCtrl.create({
      spinner: 'circles'
    });
    loading.present();
    
    let img: any;    
    if (this.selectedPhoto.startsWith('cdvphotolibrary://')||this.selectedPhoto.startsWith('file://')) {      
      let c: any = <HTMLElement>document.createElement("canvas");
      var ctx: any = c.getContext('2d');
      var image = new Image(this.platform.width(), this.platform.height());    
      c.width = this.platform.width();
      c.height = this.platform.height();
      image.src = this.webView.convertFileSrc(this.selectedPhoto);            
      const width = this.platform.width();
      const height = this.platform.height();
      ctx.drawImage(image, 10, 10, width, height);
      img = ctx.canvas.toDataURL();
    } else {
      img = this.selectedPhoto;
    }
    console.log(img);
    this.imageProvider.uploadStoryImage(img).then((url) => {
      console.log('photo path', url);
      this.storyService.addStory({
        image: url,
        userName: this.user.name,
        userPhoto: this.user.profilePic
      }).then((res) => {
        loading.dismiss();
        this.location.back();
      }).catch(e => loading.dismiss());
    }).catch(e => loading.dismiss());
  }

  changePhoto(newImage) {
    this.selectedPhoto = newImage.mediumSizeUrl;
    this.content.scrollToTop(300);

  }


  back() {
    try {
      this.location.back();
    } catch (e) {
    }
  }

  stopCamera() {
    try {
      this.cameraPreview.stopCamera().catch(e => {
        (window.document.getElementById('page-add-story') as HTMLElement).classList.remove('preview');
        (window.document.getElementById('page-add-story') as HTMLElement).classList.add('normal-view');

      });
      this.cameraPreview.hide();
    } catch (e) {

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
      height: this.platform.height()/1.9,
      toBack: true,
      previewDrag: false,
      tapPhoto: true,
      tapFocus: true
    }).then(() => {
      (window.document.getElementById('page-add-story') as HTMLElement).classList.remove('normal-view');
      (window.document.getElementById('page-add-story') as HTMLElement).classList.add('preview');
      console.log("camera started")

    }).catch(() => {
      console.log("camera error")
    })

  }

  refresh() {
    this.cameraPreview.switchCamera();
  }

}
