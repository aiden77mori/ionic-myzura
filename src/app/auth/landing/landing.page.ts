import { Component, OnInit, AfterViewInit, ViewChild, HostBinding } from '@angular/core';

import { IonSlides, MenuController } from '@ionic/angular';
import { TranslateProvider } from 'src/app/services/translate.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['landing.page.scss']

})
export class LandingPage implements OnInit {
  slidesOptions: any = {
    zoom: {
      toggle: false // Disable zooming to prevent weird double tap zomming on slide images
    }
  };

  slider_list:any=[];

  constructor(public menu: MenuController,
    public translate: TranslateProvider,

    
    ) {

   }

   ionViewDidEnter(): void{
    this.slider_list=[
      { title: this.translate.get('slide1.title'),description:this.translate.get('slide1.description'),img_url:"assets/images/landing/1.jpg" },
      { title:  this.translate.get('slide2.title'),description:this.translate.get('slide2.description'),img_url:"assets/images/landing/2.jpg" },
      { title: this.translate.get('slide3.title'),description:this.translate.get('slide3.description'),img_url:"assets/images/landing/3.jpg" },
      { title: this.translate.get('slide4.title'),description:this.translate.get('slide4.description'),img_url:"assets/images/landing/4.jpg" },
    ]
   }
  ngOnInit(): void {
    this.menu.enable(false);
  }

}
