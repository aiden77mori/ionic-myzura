import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { Location } from '@angular/common';
import { Platform, ModalController, IonSlides } from "@ionic/angular";



import { TranslateProvider } from 'src/app/services/translate.service';
// import {InAppBrowser, InAppBrowserOptions} from '@ionic-native/in-app-browser/ngx';
import { MyZuraApiService } from "src/app/services/myzura.api.service";
import { FirebaseProvider } from "src/app/services/firebase.provider";
import { DomSanitizer } from "@angular/platform-browser";
import { skip } from "rxjs/operators";
import { fromEvent } from "rxjs";



@Component({
  selector: 'page-iframe',
  templateUrl: 'iframe.html',
  styleUrls: ['iframe.scss']
})
export class IframePage {
  @Input() link:any;
  @ViewChild('iframe') iframe: ElementRef;

  productLink
  browser
  
  loading=false;
  slidesOptions: any = {
    zoom: {
      toggle: false // Disable zooming to prevent weird double tap zomming on slide images
    },
    allowTouchMove: false, //disable swipe with touch
    onlyExternal: true
  };

  constructor(
    public translate: TranslateProvider,    
    public firebaseProvider: FirebaseProvider,    
    public myzuraAPI: MyZuraApiService,    
    public modalCtrl: ModalController,
    public sanitizer: DomSanitizer
  ) {
    
  }
  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  
  ngOnInit(){
    console.log(this.link)
    this.link =  this.sanitizer.bypassSecurityTrustResourceUrl(this.link);
    fromEvent(this.iframe.nativeElement, 'load')
    // Skip the initial load event and only capture subsequent events.
    .pipe(skip(1))
    .subscribe((event: Event) => {
      this.productLink = event.target
      console.log(event.target)});
  }


  //DONT WORK ON MODALS
  ionViewDidLeave(){
  }

  dismiss() {
    this.modalCtrl.dismiss(this.productLink);
  }

  onSlideNext() {
    // this.slides.lockSwipes(false);
    // this.slides.lockSwipes(true);

  }


  searchExternally(){

    // this.browser = this.iab.create(this.link, '_blank', this.options);
    //  this.browser.on('loadstop').subscribe(event => {
    //  this.productLink = event.url;
    //   // browser.insertCSS({ code: "body{color: red;" });
    // });
  }

  
  linkFound(){
    this.browser.close()
  }


}
