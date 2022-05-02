import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';

import firebase from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { LogoutProvider } from 'src/app/services/logout.provider';
import { LoadingProvider } from 'src/app/services/loading.provider';
import { ImageProvider } from 'src/app/services/image.provider';
import { AngularFireDatabase } from '@angular/fire/database';
import { AlertProvider } from 'src/app/services/alert.provider';
import { DataProvider } from 'src/app/services/data.provider';
import { Validator } from 'src/validator';
import { environment } from 'src/environments/environment';
import { TranslateProvider } from 'src/app/services/translate.service';
 import { BrowserService } from 'src/app/services/browser.service';

@Component({
  selector: 'page-security',
  templateUrl: 'security.html',
  styleUrls: ['security.scss']
})
export class SecurityPage {
  public user: any;
  private alert: any;
  private profilePhotoOptions: CameraOptions;

  constructor(
    public alertCtrl: AlertController,
    public translate: TranslateProvider,
    public logoutProvider: LogoutProvider,
    public loadingProvider: LoadingProvider,
    public imageProvider: ImageProvider,
    public angularDb: AngularFireDatabase,
    public alertProvider: AlertProvider,
    public dataProvider: DataProvider,
    private browserService: BrowserService,

    public camera: Camera,
    private router: Router,
    private navCtrl : NavController) {
      this.profilePhotoOptions = {
        quality: 50,
        targetWidth: 384,
        targetHeight: 384,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        correctOrientation: true
      };
    this.logoutProvider.setRouter(this.router);
  }

  back(){
    this.navCtrl.back()
  }
}
