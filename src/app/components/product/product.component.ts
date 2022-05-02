/**
 * Shoppr - E-commerce app starter Ionic 4(https://www.enappd.com)
 *
 * Copyright © 2018-present Enappd. All rights reserved.
 *
 * This source code is licensed as per the terms found in the
 * LICENSE.md file in the root directory of this source .
 * 
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { IonSlides, AlertController, ModalController, PopoverController, LoadingController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { FunctionsService } from '../../services/functions.service';
// import { ApiService } from '../../api.service';
import { Router } from '@angular/router';
import { async } from 'rxjs/internal/scheduler/async';
import { PopoverComponent } from '../popover/popover.component';
import { DataProvider } from 'src/app/services/data.provider';
import { LoadingProvider } from 'src/app/services/loading.provider';
 import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import _ from 'lodash';
import { FeedProvider } from 'src/app/services/feed.provider';
 import { MyZuraClothingSizesService } from 'src/app/services/clothing.sizes';
import { TranslateProvider } from 'src/app/services/translate.service';
import { FirebaseProvider } from 'src/app/services/firebase.provider';
import { MixpanelService } from 'src/app/services/mixpanel.service';
import { BrowserService } from 'src/app/services/browser.service';

// import { ProductsPage } from '../../modal/products/products.page';

@Component({
  selector: 'app-component-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  inputs: ['product', 'slider']
})
export class ProductComponent implements OnInit {

  @Input() product: any;
  @Input() user: any;
  @Input() addedCloset: boolean;
  @Input() slider: IonSlides;
  @Output() notify: EventEmitter<Number> = new EventEmitter<Number>();
  public loading: boolean = true;
  public timelineData: any;
  slideOpts = {
    effect: 'flip'
  };
  open = [false, false, false, false];
  liked = false;
  sizes 


  wishlisted:boolean = false;
  constructor(
    public dataProvider: DataProvider,
    public clothingSizes: MyZuraClothingSizesService,
    public router: Router, 
    public popoverController: PopoverController,
    private nativeGeocoder: NativeGeocoder,
    public feedProvider: FeedProvider,
    public translate: TranslateProvider,
    public firebaseProvider: FirebaseProvider,
    private browserService: BrowserService,
    private mixpanelService : MixpanelService,
    public loadingCtrl: LoadingController,private fun: FunctionsService, public loadingProvider: LoadingProvider, public alertController: AlertController,
    private socialSharing: SocialSharing) { 
      console.log(this.product)
 
    }

    async addToCloset(productId){
      this.mixpanelService.track("AddToCloset", {
        product: productId,
        source: "ProductDetails",
        timestamp: Date.now()
      })
      await this.dataProvider.getCLosetList().push({
        productId: productId,
        timestamp: Date.now()
      })
    }
  
  
 async  openShopLink(link, productId){
  this.mixpanelService.track("OpenShopLink", {
    product: productId,
    link: link,
    source: "ProductDetails",
    timestamp: Date.now()
  })
    await this.dataProvider.getCLosetPlusRef().once('value',async (data:any)=>{
      let productIds=[]
      data = data.val()
      if(data){
       let dataAux:any = Object.values(data)
       dataAux.forEach(product => {
          productIds.push(product.productId)
        });

       
      }
      if(!productIds.includes(productId)){
        await this.dataProvider.getCLosetPlusList().push({
          productId: productId,
          timestamp: Date.now()
        })
      }
   
    })
    let browser = this.browserService.browseLink(link);
  }


  goToReviews() {
    this.notify.emit(2);
  }

  toogle(i) {
    this.open[i] = !this.open[i];
  }

  remove() {
    this.slider.lockSwipes(true);
  }

  gainback() {
    this.slider.lockSwipes(false);
  }

  like() {
    console.log('like')
    this.liked = !this.liked;
  }

  shareViaInstagram(img) {
    // Check if sharing via email is supported
    this.socialSharing.canShareVia('instagram').then(() => {
      // Sharing via email is possible
      this.socialSharing.shareViaInstagram('Hey ! Look at the new dress I just bought from MyZura. Find more such apps at ', 'www/' + img).then(() => {
        // Success!
      }).catch(() => {
        // Error!
        this.createAlert('Error sharing product via Instagram. Please check if you have Instagram app on the device')
      });
    }).catch(() => {
      // Sharing via email is not possible
      this.createAlert('Could not find Instagram app on the device. Please install Instagram and try again.')
    });
  }

  async createAlert(msg) {
    const alert = await this.alertController.create({
      header: 'Sorry',
      subHeader: 'App not found',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  shareCommon(img) {
    console.log(img);
    this.socialSharing.share('Hey ! Look at the new dress I just bought from MyZura. Find more such apps at ', 'Enappd store - MyZura', 'www/' + img, 'myzura.com').then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }

  
  async ngOnInit() {
    this.firebaseProvider.dataProvider.checkProductWishlist(this.product.id).then((check:any)=>{
      this.wishlisted = check
    })
    let reviews = this.product.reviews      
    try {
      let brand = this.product.brand
      let gender = this.product.gender
      let bodyCat=""
      this.sizes={}
      // if(this.product.category !=""){
      //   if(this.product.category.includes(",")){
      //     bodyCat = this.product.body_category.split(",")[0]
      //     console.log("getting sizes",)

      //   }
      // }

      this.clothingSizes.getSizes(brand, gender, "EU", this.product.category).then((sizes:any)=>{
        console.log(sizes)
        if(sizes){
          this.sizes = sizes
        }
      })
    } catch (error) {
      
    }
    if(reviews){
      console.log(reviews)
      this.timelineData = []
      this.timelineData = await this.feedProvider.getTimelineProducts(reviews);
      this.loading = false;

    }

    


  }
 
  ionViewWillEnter() {
    console.log('activity list view');   
  //  this.get_activites();    
   }


   getList(event){
    console.log(event);
    setTimeout(()=>{
      event.target.complete();
    },3000);
    

   }

   change_like(item,status){
     if (status==0)
       item.like_count=item.like_count-1;
     else if(status==1)
       item.like_count=item.like_count+1;
    
      item.like_status=status;
   }


  async openMenu(item, events) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: events,
      mode: 'ios',
    });

    popover.onDidDismiss().then(data => {
      console.log(data.data);           
    });

    await popover.present();
  }


  locationAddress(location, success) {

    this.nativeGeocoder.reverseGeocode(location.lat, location.long)
      .then((result: any) => {
        console.log(JSON.stringify(result));
        success(result);
      }).catch((error: any) => console.log(error));
  }
  open_comment(item){
    console.log(item);
    this.router.navigate(['app/home/comment']);

  }

  async open_product(products,i){
    // console.log(products);
    // console.log(i);

    // this.api.sel_products=products;

    // const modal = await this.modalController.create({
    //   component: ProductsPage,
    //   cssClass: 'tagProduct-modal',
    //    showBackdrop: true,
    //    backdropDismiss: true,
    //    componentProps: {
    //     'index': i
    //   }
    // });

    // modal.onDidDismiss().then((dataReturned) => {
    //   console.log(dataReturned);
    //   console.log("closed modal");
    // });

    
    // await modal.present().then(() => {
    // });
  
  }
  ObejctSize = (obj)=> {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
  getSize(revs){
    let size = this.ObejctSize(revs);
    if(size) return size;
    else return 0
  }

  logRatingChange(e){
    console.log(e)
  }


  async addWishList(id){

    this.mixpanelService.track("AddWishList", {
      product: id,
      source: "ProductDetails",
      timestamp: Date.now()
    })
   await this.firebaseProvider.dataProvider.addProductWishlist(id)
   this.firebaseProvider.dataProvider.checkProductWishlist(this.product.id).then((check:any)=>{
    this.wishlisted = true
  })
  }
 async removeProductWishlist(id){
    this.mixpanelService.track("RemoveWishList", {
      product: id,
      source: "ProductDetails",
      timestamp: Date.now()
    })
   await this.firebaseProvider.dataProvider.removeProductWishlist(id)
   this.wishlisted = false
    
  }

  addSizes(){
    this.router.navigateByUrl('/tabs/profile/settings')
  }
}