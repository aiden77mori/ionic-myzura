import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, ModalController, NavController } from '@ionic/angular';
import _ from 'lodash';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {  take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LoadingProvider } from '../../services/loading.provider';
import { AngularFireDatabase } from '@angular/fire/database';
import { DataProvider } from '../../services/data.provider';
import { FirebaseProvider } from '../../services/firebase.provider';
import { TranslateProvider } from 'src/app/services/translate.service';
import { SampleShellListingModel } from 'src/app/services/shell/sample-shell.model';
import { FiltersPage } from './filters/filters';
import { ProductsProvider } from 'src/app/services/providers/producs.provider';
import { MyZuraApiService } from 'src/app/services/myzura.api.service';
import { Events } from 'src/app/services/Events';
import { WishlistPage } from './wishlist/wishlist';
import { ProductsFilterProvider } from 'src/app/services/providers/products.filter.provider';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { GlobalDataService } from 'src/app/services/global.data.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocalProductsProvider } from 'src/app/services/providers/localproducs.provider';

/**
 * This page show us user's friends posts 
 * and following users posts
 *
 */

@Component({
  selector: 'page-marketplace',
  templateUrl: 'marketplace.html',
  styleUrls: ['marketplace.scss']
})
export class MarketplacePage implements OnInit {
  routeProductsResolveData: SampleShellListingModel;
  @ViewChild(IonContent, { static: false }) content: IonContent;


  private user: any;
  public friendsList: any;
  public users: any;
  searchProduct: String;
  excludedIds: any = [];

  hash: boolean = false;
  icons: string = 'post';
  public stories: Observable<any>;
  public loading: boolean = true;

  products$: Observable<any[]>;
  filterProducts$: Observable<any[]>;
  public outputFilters={

    categories:[],
    brands:[], 
    color:"",
    gender:"Male",
    price:"",
    reset:true,
    categoryList:null
  }


  userId
  recommendedProducts=[]
  fullProducts =[]

  marketplaceType = "foryou"
  categoryType="";

  currentLocation
  localProducts$ : Observable<any[]>;

  newMarketplaceProducts=[]
  newMarketplaceProductNames=[]

  favBrands=[]
  constructor(
    private myzuraApi:MyZuraApiService,
    private location: Location,
    public translate: TranslateProvider,
    public loadingProvider: LoadingProvider,
    public angularDb: AngularFireDatabase,
    public dataProvider: DataProvider,
    public productsProvider: ProductsProvider,
    public localProductsProvider: LocalProductsProvider,
    public productsFilterProvider: ProductsFilterProvider,
    public firebaseProvider: FirebaseProvider,
    public modalCtrl: ModalController,
    public events: Events,
    public keyboard: Keyboard,
    public navCtrl: NavController,
    public route: ActivatedRoute,
    private globalData: GlobalDataService,
    private geolocation: Geolocation,
    // public storyService: StoryService
    ) {
    

      this.outputFilters.categoryList = this.globalData.CATEGORIES.sort(function(a, b) {
        var textA = a.name.toUpperCase();
        var textB = b.name.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    this.loadNewMarketplaceProducts();

  }

  loadNewMarketplaceProducts(){
    this.firebaseProvider.dataProvider.getNewMarketplaceProducts().query.once('value',(res:any)=>{
      let obj = res.val();
      console.log(Object.values(obj));
      this.newMarketplaceProducts=Object.values(obj)
    })
  }


  ///LOCAL
  locationShare() {
    // this.loadingProvider.show();
    var options = { timeout: 10000, enableHighAccuracy: false };

    this.geolocation.getCurrentPosition(options).then((position) => {
      this.currentLocation = position.coords.longitude+"," +position.coords.latitude

      console.log( this.currentLocation)

      this.localProductsProvider.destroy()
      this.myzuraApi.getLocalProducts({
        user_id: this.firebaseProvider.getCurrentUserId(),
        user_location: this.currentLocation
      }).then((products:any)=>{
        this.localProductsProvider.setList(products)
  
        this.localProducts$ = this.localProductsProvider.localProducts$;
   
      })

      //  this.loadingProvider.hide();
      // success();
    }, (err) => {
      this.loadingProvider.hide();
      console.log(err);
    });
  }



  sel_cat(i,type) {

    // if (type==1){
    if (this.outputFilters.categoryList[i].status==true)
      this.outputFilters.categoryList[i].status=false;
    else if (this.outputFilters.categoryList[i].status==false)
      this.outputFilters.categoryList[i].status=true;
    // }else if (type==2){
    //   if (this.logolist[i].status==true)
    //    this.logolist[i].status=false;
    //   else if (this.logolist[i].status==false)
    //     this.logolist[i].status=true;

    // }

 
    this.outputFilters.reset = false

    this.outputFilters.categoryList.forEach(c=>{
      if(c.status){
        this.outputFilters.categories.push(c.value);
      }
    })

    let params = {
      user_id: this.firebaseProvider.getCurrentUserId(),
      color: this.outputFilters["color"],
      gender:  this.outputFilters["gender"],
      categories: this.outputFilters["categories"],
      brands: this.outputFilters["brands"],
      price:  this.outputFilters["price"]

    }

    this.productsFilterProvider.destroy()
    this.myzuraApi.getProductsByFilter(params).then((products:any)=>{
      this.productsFilterProvider.setList(products)

      this.filterProducts$ = this.productsFilterProvider.filterProducts$;
 
    })
  }

  async ngOnInit() {
    this.locationShare()
    this.userId = this.firebaseProvider.getCurrentUserId()
    
    this.dataProvider.getFavBrands(this.userId).query.once("value", res=>{
      console.log(res)
      if(!res.val()){
        this.dataProvider.getFavBrands(this.userId).set(
         {
          zara: "Zara",
          adidas:"Adidas",
          bershka: "Bershka",
          bluyins: "Bluyins",
          handm: "H&M",
          mango: "Mango",
          nike:"Nike",
          shein:"Shein"          
         }
        )
        this.favBrands = Object.values(         {
          zara: "Zara",
          adidas:"Adidas",
          bershka: "Bershka",
          bluyins: "Bluyins",
          handm: "H&M",
          mango: "Mango",
          nike:"Nike",
          shein:"Shein"          
         })
      }else{
        this.favBrands = Object.values(res.val())
      }
    })
    this.products$ = this.productsProvider.products$;
    // this.fullProducts = this.productsProvider.products$;
  }

  //////start SCROLOL TOP
  ionViewWillEnter() {
    this.events.subscribe('tabs', tabNumber => {
        if (tabNumber === 'marketplace') { 
            this.content.scrollToTop(1000); 
        } 
    });
  }

  ionViewDidLeave() {
    // this.events.destroy('tabs');
  }
  //////END SCROLOL TOP
  
  //ADD RESET A FALSE IF CHANGED
  searchEvent(key){
    console.log(key)
    if(key == 13){
      this.keyboard.hide();

      if(this.searchProduct){
        this.outputFilters.reset=false;
  
        let params = {
          keyword: this.searchProduct,
          user_id:  this.firebaseProvider.getCurrentUserId()
          // color: this.outputFilters["color"],
          // gender:  this.outputFilters["gender"],
          // categories: this.outputFilters["categories"],
          // brands: this.outputFilters["brands"],
          // price:  this.outputFilters["price"]
  
        }
        this.productsFilterProvider.destroy()

        this.myzuraApi.getProductsBySearchFilter(params).then((products:any)=>{

          console.log(products)
          this.productsFilterProvider.setList(products)
  
          this.filterProducts$ = this.productsFilterProvider.filterProducts$;
          // this.productsFilterProvider.nextPage()
  
          // this.fullProducts = []
          // Object.values(products.filtered_products).map(async (key)=>{
          //   await this.dataProvider.getProductById(key).query.once("value", res=>{
          //     this.fullProducts.push(res.val())
          //   })
  
          //   console.log(this.fullProducts);
  
          // })
        })
      }
    }
  }


  clearSearch(){
    this.outputFilters.reset = true
    // this.outputFilters.categoryList.forEach((c,i)=>{
    //   this.outputFilters.categoryList[i].status = false
    // })
    this.productsFilterProvider.destroy()

  }
  async openFilters(){
    let modal = await this.modalCtrl.create({
      component: FiltersPage,
      componentProps: { 
        outputFilters:this.outputFilters,
        // profilePic: this.user.profilePic ? this.user.profilePic : 'assets/profile.png',
        // update: (comment: any) => {
        //   const { comments } = this.item;
        //   if (comments) {
        //     this.item.comments = comments + 1;
        //   } else {
        //     this.item.comments = 1;
        //   }

        //   this.item.isComment = true;
        // }
      }
    });

    modal.onDidDismiss()
    .then((data) => {
      this.fullProducts = []
      this.outputFilters = data['data']; // Here's your selected user!
      console.log("DATA RETURNED,", this.outputFilters)
      if(!this.outputFilters.reset){
        let params = {
          user_id: this.firebaseProvider.getCurrentUserId(),
          color: this.outputFilters["color"],
          gender:  this.outputFilters["gender"],
          categories: this.outputFilters["categories"],
          brands: this.outputFilters["brands"],
          price:  this.outputFilters["price"]
  
        }

        this.productsFilterProvider.destroy()
        this.myzuraApi.getProductsByFilter(params).then((products:any)=>{
          this.productsFilterProvider.setList(products)
  
          this.filterProducts$ = this.productsFilterProvider.filterProducts$;
          // this.productsFilterProvider.nextPage()
  
          // this.fullProducts = []
          // Object.values(products.filtered_products).map(async (key)=>{
          //   await this.dataProvider.getProductById(key).query.once("value", res=>{
          //     this.fullProducts.push(res.val())
          //   })
  
          //   console.log(this.fullProducts);
  
          // })
        })
      }
    });
    modal.present();



  }

  //View User  
  viewUser(userId) {
    // this.router.navigateByUrl('tabs/user-info', { state: { userId } });
  }

  back() {
    this.location.back();
  }

  gotoWear(){
    this.navCtrl.navigateForward('tabs/category');
  }
  openOptions(param) {

  }

  doInfiniteFilters(infiniteScrollEvent): Promise<void> {
    console.log("infiniteScrollEvent")
    console.log(infiniteScrollEvent)
    return new Promise((resolve, reject) => {

      this.productsFilterProvider.nextPage()
        .pipe(take(1))
        .subscribe(products => {
          console.log('Products!', products);
          infiniteScrollEvent.target.complete();

          // this.products$ = this.productsProvider.products$;


          resolve();
        });

    });
  
    // return Promise.resolve();
  }
  doInfiniteLocal(infiniteScrollEvent): Promise<void> {
    console.log("infiniteScrollEvent")
    console.log(infiniteScrollEvent)
    return new Promise((resolve, reject) => {

      this.localProductsProvider.nextPage()
        .pipe(take(1))
        .subscribe(products => {
          console.log('Products!', products);
          infiniteScrollEvent.target.complete();

          // this.products$ = this.productsProvider.products$;


          resolve();
        });

    });
  
    // return Promise.resolve();
  }

  doInfinite(infiniteScrollEvent): Promise<void> {
    console.log("infiniteScrollEvent")
    console.log(infiniteScrollEvent)
    return new Promise((resolve, reject) => {

      this.productsProvider.nextPage()
        .pipe(take(1))
        .subscribe(products => {
          infiniteScrollEvent.target.complete();

          // this.products$ = this.productsProvider.products$;


          resolve();
        });

    });
  
    // return Promise.resolve();
  }


  openQr(){
    alert("COMING SOON")
  }

 async openFavorites(){
     console.log("Modal")
    let modal = await this.modalCtrl.create({
      component: WishlistPage,
      componentProps: { 
        // products:this.routeProductsResolveData?.items,
        // profilePic: this.user.profilePic ? this.user.profilePic : 'assets/profile.png',
        // update: (comment: any) => {
        //   const { comments } = this.item;
        //   if (comments) {
        //     this.item.comments = comments + 1;
        //   } else {
        //     this.item.comments = 1;
        //   }

        //   this.item.isComment = true;
        // }
      }
    });
    modal.present();
    // this.navCtrl.navigateForward('tabs/marketplace/wishlist');
  }

  openCategory(){
    this.marketplaceType = 'categories';
  }

  openLocalBrand(){
    this.categoryType = "localbrand";
    this.navCtrl.navigateForward('tabs/category', {queryParams: {categoryType: this.categoryType}});
  }

  openWear(){
    this.categoryType = "wear";
    this.navCtrl.navigateForward('tabs/category', {queryParams: {categoryType: this.categoryType}});
  }

  openSustainableBrand(){
    this.categoryType = "susbrand";
    this.navCtrl.navigateForward('tabs/category', {queryParams: {categoryType: this.categoryType}});
  }

  reset(){
    this.filterProducts$ = null;
    this.outputFilters.reset = true
    this.outputFilters.categoryList.forEach((c,i)=>{
      this.outputFilters.categoryList[i].status = false
    })
  }
  searchChangeEvent(){
    if(this.searchProduct ==""){
      this.filterProducts$ = null;
      this.outputFilters.reset = true
    }
  }

  get CategoryType(){
    console.log(this.categoryType);
    return this.categoryType;
  }
}
