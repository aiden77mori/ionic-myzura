import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { LoadingController, NavController } from '@ionic/angular';
import { LoadingProvider } from 'src/app/services/loading.provider';
import { ImageProvider } from 'src/app/services/image.provider';
import { AngularFireDatabase } from '@angular/fire/database';
import { TranslateProvider } from 'src/app/services/translate.service';
import { GlobalDataService } from 'src/app/services/global.data.service';
import { MyZuraApiService } from 'src/app/services/myzura.api.service';
import firebase from 'firebase';
import { MixpanelService } from 'src/app/services/mixpanel.service';
import { DataProvider } from 'src/app/services/data.provider';
import { AlertProvider } from 'src/app/services/alert.provider';

@Component({
  selector: 'page-publish-product',
  templateUrl: 'publish-product.html',
  styleUrls: ['publish-product.scss']
})
export class PublishProductPage implements OnInit {

  description=""
  name=""
  step="photo"

  myProduct
  categories=[]
  category=""
  brands=[]
  brand=""
  brandOther=""
  gender="female"
  @Input() image: any;

  constructor(
    private alert :AlertProvider,
    public sanitizer: DomSanitizer,
    public translate: TranslateProvider,
    public loadingProvider: LoadingProvider,
    public imageProvider: ImageProvider,
    public navCtrl: NavController,
    public angularDb: AngularFireDatabase,
    private globalData : GlobalDataService,
    private myzuraApi: MyZuraApiService,
    private mixpanelService : MixpanelService,
    private dataProvider : DataProvider
  ) {

    this.categories = this.globalData.CATEGORIES.sort(function(a, b) {
      var textA = a.name.toUpperCase();
      var textB = b.name.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  });

   this.globalData.BRANDS().then(brands=>{
    this.brands = brands.sort(function(a, b) {
          var textA = a.name.toUpperCase();
          var textB = b.name.toUpperCase();
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
   })

  console.log(this.brands)

  let other =[  {name: 'Other',image:'assets/imgs/logo/1.png',link: "", status:false }]
  this.brands = other.concat(this.brands)
  console.log(this.brands)
  }
  getCategoryTranslation(cat){
    let catKey = cat.toLowerCase()
    catKey = catKey.replace(/\s/g, '')
    let tr = cat;

    if(this.translate.get("filters."+catKey+".cat")){
      tr = this.translate.get("filters."+catKey+".cat");
    }

    return(tr)
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


  removeImageBG(){
    return new Promise((resolve, reject) => {
      let base64 = this.image.replace("data:image/png;base64,", "")

      this.myzuraApi.imageBGRemove({base64_image:[base64]}).then((res:any)=>{
        console.log(res)
        resolve(res[0])
      }).catch(()=>{
        resolve(false)
      })
    })
  }


  genderChanged(e){
    this.gender=e.detail.value

  }
  capitalize_Words(str)
  {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

 async shareCheck(){
  if(this.gender && (this.brand || this.brandOther) && this.category){
    this.loadingProvider.showLoading()

    let brand = this.brand
    if(this.brand == "Other"){
      brand = this.brandOther
    }
    let userId = firebase.auth().currentUser.uid
    const res = await this.angularDb.list('products').push({
      name: this.capitalize_Words(this.name),
      description:this.capitalize_Words(this.description),
      shop_url: "",
      affiliate_url: "",
      brand: this.capitalize_Words(brand),
      price:  '',
      oldPrice: "",
      currency:  '',
      //   reviews: response.id,
      additionalProperty:null,
      gender: this.gender,
      category: this.category,
      body_category: "",
      //   photos: response.id,
      shop_photos: null,
      availability:  '',
      //   colors: response.id,
      //   tags: response.id,
      //   average_smile_level: response.id,
      //   last_reviewed:response.id,
      last_updated:Date.now(),
      language:  'es',
      sku: '',
      reviewedByAdmin:false,
      postedBy: userId,
      capturedProduct : true
      }).catch(err => {
      console.log('error while uploading post:', err);
      this.loadingProvider.hideLoading()
      alert("There was an error, please try again")
    });
    if(res){

      let productId = res.key;
      await this.angularDb.object('products/'+productId).update({id: productId})
      this.mixpanelService.track("CapturedProduct", {
        product: productId,
        source: "Publish-Product",
        timestamp: Date.now()
      })

      this.removeImageBG().then(async (base64:string)=>{

        if(base64){
          this.addToCloset(productId)
          this.imageProvider.uploadProductImage(productId, base64).then(status=>{
            if(!status){
              this.loadingProvider.hideLoading()
              alert("There was an error, please try again")
            }else{
              this.loadingProvider.hideLoading()
              this.alert.addReviewPopup();
            }
          })
        }else{
          this.loadingProvider.hideLoading()
          alert("There was an error, please try again")

        }


      })
    }

  }else{
    alert("Fill in all the fields")
  }
 }
  ngOnInit() {

    // this.myPost.onmousedown = this.GetCoordinates;


    const state: any = (window as any).history.state;
    const {image, _}= state;
    this.image = image
    this.myProduct = document.getElementById("myProduct");

  };

  ionViewDidLeave(){
    this.image = null
  }

  back() {
    this.navCtrl.back();
  }


  backPhoto(){
     this.step="photo"
  }

  next(){
     if(this.step=="photo" && this.name){
      this.step="details"
     }
  }





}
