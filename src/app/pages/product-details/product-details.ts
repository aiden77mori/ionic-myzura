import { Component, ViewChild, ElementRef, NgZone, OnInit } from '@angular/core';
import { ModalController, IonInfiniteScroll, NavController, IonSlides, IonContent } from '@ionic/angular';

import * as firebase from 'firebase';
import _ from 'lodash';
// import { AnimationBuilder } from 'css-animator';
import { SafeHtml } from '@angular/platform-browser';
import { NativeGeocoder, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';

import { Router, ActivatedRoute } from '@angular/router';
import { take, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { LoadingProvider } from 'src/app/services/loading.provider';
import { AngularFireDatabase } from '@angular/fire/database';
import { DataProvider } from 'src/app/services/data.provider';
import { FirebaseProvider } from 'src/app/services/firebase.provider';
import { FeedProvider } from 'src/app/services/feed.provider';
import { TranslateProvider } from 'src/app/services/translate.service';
import { RelatedProductsProvider } from 'src/app/services/providers/related.products.provider';
import { MixpanelService } from 'src/app/services/mixpanel.service';

@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
  styleUrls: ['product-details.scss']
})



export class ProductDetailsPage{
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;

  //PRODUCT DETAILS
   
  @ViewChild('Slides', {}) slides: IonSlides;
  @ViewChild('Content',  {}) content: IonContent;
  @ViewChild('slider',  {}) slider: IonSlides;

  view ='details'
  index = 0;
  segment = '';
  slideOpts = {
    effect: 'flip',
    zoom: false,
    // autoHeight: true,
    allowTouchMove: false //disable swipe with touch
  };

  // data: Array<HomeTab> = [];
  data:any
  product: any={};
  addedCloset=false;
  products: any;


  public loading: boolean = true;
  public user: any;
  public timelineData: any;
  public friendsList: any;
  private page: number = 1;
  productId:any=""
  public productsData: any =[];
  relatedProducts$: Observable<any[]>;
  constructor(public router: Router,
    public translate: TranslateProvider,
    public loadingProvider: LoadingProvider,
    public angularDb: AngularFireDatabase,
    public dataProvider: DataProvider,
    public firebaseProvider: FirebaseProvider,
    public modalCtrl: ModalController,
    public navCtrl:NavController,
    public relatedProductsProvider: RelatedProductsProvider,
    // public storyService: StoryService,
    private elmRef: ElementRef,
    private feedProvider: FeedProvider,
    private route: ActivatedRoute,
    private mixpanelService: MixpanelService
  ) {


  }

 

  async ionViewWillEnter() {
    this.mixpanelService.setUserId(this.firebaseProvider.dataProvider.currentUser.uid)

    this.route.params.subscribe(async queryParams => {
      console.log(queryParams)
      this.productId = queryParams["productId"]

      this.mixpanelService.track("productDetails", {
        product: this.productId,
        timestamp: Date.now()
      })
      this.relatedProductsProvider.destroy();  

      this.relatedProductsProvider.setProductId(this.productId)
      this.relatedProducts$ = this.relatedProductsProvider.relatedProducts$;

      await this.dataProvider.getCLoset().valueChanges().subscribe((data:any)=>{
        let productIds=[]
        if(data){
         let dataAux:any = Object.values(data)
         dataAux.forEach(product => {
            productIds.push(product.productId)
          });

         
        }
        if(productIds.includes(this.productId)){
          this.addedCloset = true;
        }
        console.log(productIds, "=================================>")
      
      })

      //Get Products
    await this.dataProvider.getProductById(this.productId ).snapshotChanges()
     .pipe(map(actions => actions.map((snapshot:any) => {
       if(snapshot.key == 'shop_photos'){
        this.product[snapshot.key] = JSON.parse(snapshot.payload.val());

       }else{
        this.product[snapshot.key] = snapshot.payload.val();

       }

    })), take(1)).toPromise().then(()=>{
      // this.product.shop_photos =  this.getCorrectImages( this.product.shop_photos)
      console.log(this.product.shop_photos )
    })
     
 
    })
    this.user = await this.dataProvider.getCurrentUser()
      .pipe(take(1))
      .toPromise();


  
    this.loadingProvider.hide();
    const { following } = this.user;
    let storiesList = [this.user.userId];

    if (following)
      storiesList = [...storiesList, ...following];


    this.timelineData = await this.feedProvider.getTimeline();
    if (this.elmRef.nativeElement.querySelector('hashtagevt')) {
      this.elmRef.nativeElement.querySelector('hashtagevt').addEventListener('click', alert(this));
    }
    
    this.loading = false;

  }

 
  // ionViewDidLeave() {
  //   this.relatedProductsProvider.destroy();  
  // }
  // ngOnDestroy() {
  //   this.relatedProductsProvider.destroy();  
  // }

  async loadData(evt: any){
    this.page = this.page + 1;
    this.timelineData = await this.feedProvider.getTimeline(this.page);
    evt.target.complete();
  }

  change(){}


  back() {
    this.navCtrl.back();
  }

  toggleView(event){
    this.view = event.detail.value
    //console.log(event.detail.value);
    if(event.detail.value=='related'){
      this.slides.slideNext(1000, false);

    }else{
      this.slides.slidePrev(1000, false);

    }

  }

  

  doInfinite(infiniteScrollEvent): Promise<void> {
    console.log("infiniteScrollEvent")
    console.log(infiniteScrollEvent)
    if (!this.productsData.finished) {
      return new Promise((resolve, reject) => {

        this.relatedProductsProvider.nextPage()
          .pipe(take(1))
          .subscribe(products => {
            console.log('Products!', products);
            infiniteScrollEvent.target.complete();

            // this.relatedproducts$ = this.productsProvider.relatedproducts$;


            resolve();
          });

      });
    }
    return Promise.resolve();
  }

}
