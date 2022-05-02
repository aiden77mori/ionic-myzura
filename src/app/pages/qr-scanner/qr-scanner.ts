import { ChangeDetectorRef, Component } from "@angular/core";
import {  ModalController, NavController } from "@ionic/angular";

import { TranslateProvider } from 'src/app/services/translate.service';
import { BarcodeScanner, BarcodeScannerOptions } from "@ionic-native/barcode-scanner/ngx";
import { GlobalDataService } from '../../services/global.data.service';
import { MyZuraApiService } from "src/app/services/myzura.api.service";
import { FirebaseProvider } from "src/app/services/firebase.provider";

 import { MixpanelService } from "src/app/services/mixpanel.service";
import { BrowserService } from "src/app/services/browser.service";
// import { PhotoLibraryProvider } from "src/app/services/photo.library.provider";
import { PublishProductPage } from "../publish-product/publish-product";
import { AlertProvider } from "src/app/services/alert.provider";

@Component({
  selector: 'page-qr-scanner',
  templateUrl: 'qr-scanner.html',
  styleUrls: ['qr-scanner.scss']
})
export class QrScannerPage {

  options: BarcodeScannerOptions = {
    preferFrontCamera: false,
    showFlipCameraButton: true,
    showTorchButton: true,
    torchOn: false,
    prompt: 'Place a barcode inside the scan area',
    resultDisplayDuration: 50,
    formats: 'QR_CODE',
    orientation: 'portrait',
  };

  loading=false;
  loading2=false;



  productLink: any
  product:any={}


  browser:any
  hideFab = true;

  currentPage = "find" //find | add | found

  categories:any[]
  userId:any


  brand
  gender ="female"
  category

  productId
  scrapping:any //scrappinghub result
  found=false
  slidePage=1;
  addedCloset


  brands=[]
  searchBrand =""

  logo='data:image/png;base64,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'
  constructor(private barcodeScanner: BarcodeScanner,
    private globalData:  GlobalDataService,
    public translate: TranslateProvider,    
    public firebaseProvider: FirebaseProvider,    
    public myzuraAPI: MyZuraApiService,    
    public modalCtrl: ModalController,
    private alert: AlertProvider,
    private navCtrl: NavController,
    private mixpanelService : MixpanelService,
    public changeDetectorRef: ChangeDetectorRef,
    private browserService: BrowserService,
    // private photoLib: PhotoLibraryProvider

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
    this.userId = this.firebaseProvider.getCurrentUserId();

  
  }


  ionViewDidLeave(){
  }

  // clipboardPaste(){
  //   this.clipboard.paste().then(
  //     (resolve: string) => {
  //        this.productLink = resolve;
  //      },
  //      (reject: string) => {
  //        console.log('Error: ' + reject);
  //      }
  //    );
  //  }



  async ionViewDidEnter() {
    this.slidePage=1

  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  back(){
    this.slidePage = 1
  }





  ////BARCODE
  scanBarcodeQR() {
    this.barcodeScanner.scan(this.options).then(async barcodeData => {
      this.mixpanelService.setUserId(this.userId)
      this.mixpanelService.track("ScanQR", {
        scannedData: barcodeData,
        timestamp: Date.now()
      })
      console.log('Barcode data', barcodeData);
      this.productLink = barcodeData.text;
      await this.addToCloset(this.productLink)
      this.changeDetectorRef.detectChanges();

      //SOLUTION: THIS IS NEEDED TO LET ANGULAR KNOW THE CHANGES 
      //https://stackoverflow.com/questions/56188816/variable-not-updating-in-template-when-set-inside-subscribe-method
  
    }).catch(err => {
      console.log('Error', err);
    });
  }

  scanBarcode(){
    try {
      this.scanBarcodeQR()
    } catch (error) {
      this.scanBarcodeQR()
    }
  }



  
  linkFound(){

    this.hideFab=true
    this.browser.close()
  }


 isURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

    return pattern.test(str);
  }


  checkLink(link){
    // const brands = ["pullandbear"]
    if(this.isURL(link)){
      
    }else{
      alert("Sorry, Invalid Link")
    }

  }
  genderChanged(e){
    this.gender = e.detail.value
    
  }

  async addClosetProduct(productId){
    this.mixpanelService.setUserId(this.userId)
    this.mixpanelService.track("AddToCloset", {
      product: productId,
      source: "QRPage",
      timestamp: Date.now()
    })
    console.log(productId)
    await this.firebaseProvider.dataProvider.getCLosetRef().once('value',async (data:any)=>{
      let productIds=[]
      data = data.val()
      if(data){
       let dataAux:any = Object.values(data)
       dataAux.forEach(product => {
          productIds.push(product.productId)
        });

       
      }
      if(!productIds.includes(productId)){
        await this.firebaseProvider.dataProvider.getCLosetList().push({
          productId: productId,
          timestamp: Date.now()
        })

        //AFTER ADDING IT WE CAN REMOVE IT:)
        // this.firebaseProvider.dataProvider.deleteCLosetPlusListProductById(productKey)

      }

      setTimeout(()=>{
        this.modalCtrl.dismiss()
        this.alert.addReviewPopup();
      }, 3000)   
    })
      
    } 



    async addProductPage(){
      this.modalCtrl.dismiss().then(res=>{
        this.navCtrl.navigateForward('tabs/crop-product');

      })
      //   this.photoLib.openGallery().then(async image=>{
      //     this.modalCtrl.dismiss()


      //       // let modal = await this.modalCtrl.create({
      //       //   component: PublishProductPage,
      //       //   componentProps: { 
      //       //     image: image,
      //       //     // update: (comment: any) => {
      //       //     //   const { comments } = this.item;
      //       //     //   if (comments) {
      //       //     //     this.item.comments = comments + 1;
      //       //     //   } else {
      //       //     //     this.item.comments = 1;
      //       //     //   }
        
      //       //     //   this.item.isComment = true;
      //       //     // }
      //       //   }
      //       // });
      //       // modal.present();
      //  })
      


      // this.modalCtrl.dismiss()
      // this.navCtrl.navigateForward('tabs/product-details/'+productId)

      
  
    }

  open(productId){
    this.modalCtrl.dismiss()
    this.navCtrl.navigateForward('tabs/product-details/'+productId)

  }
  getNameFromURL(url){
    let domain = (new URL(url));
    url = domain.hostname.replace('www.','');

    return url.replace(/^.*\/|\.[^.]*$/g, '');
  }
  getGenderFromURL(url){
    let gender ='Female'
    if(url.includes('woman') || url.includes('women') || url.includes('mujer') || url.includes('female')){
      gender='Female'
    }else{
      if(url.includes('man') || url.includes('men')||url.includes('hombre') || url.includes('male')){
        gender='Male'
      }
    } 
    return gender;
  }

  async openIframeBrand(brand){

    // this.addToCloset("https://www.bershka.com/es/abrigo-con-lana-cintur%C3%B3n-c0p104770160.html?colorId=700")
//  const res :  any = this.browserService.getLink(brand)

//  let codeData = res[0]
//  let browser = res[1]


 const browser = this.browserService.iab.create(brand, '_blank', 'lefttoright=yes,toolbar=no,location=no');
 /*
  browser.on('loadstart').subscribe(event => {
    if(event.url.indexOf('closeapp') !== -1) {
      let currenturl = (event.url).replace('closeapp', '');
      console.log(currenturl);
      browser.close();
    }
  });*/

  browser.on('loadstart').subscribe(async event => {
    if(event.url.indexOf('closeapp') !== -1) {
      let currenturl = (event.url).replace('closeapp', '');
    console.log(currenturl);
    browser.close();

    await this.addToCloset(currenturl).then(res=>{
      this.loading = false;
    })
    this.changeDetectorRef.detectChanges();
    }
  });

  browser.on('loadstop').subscribe(event => {
    let pageData = '';
    // if(page == 1) {
      pageData = `var arrowButtonTopLeft = document.createElement('I');
      arrowButtonTopLeft.style = 'border-style: solid; border-color: black; border-width: 0px 4px 4px 0px; display: inline-block; padding: 6px; transform: rotate(135deg); -webkit-transform: rotate(135deg); margin-top: 25px; margin-left: 20px; z-index: 999999;'; 
      topContainer.appendChild(arrowButtonTopLeft);
      arrowButtonTopLeft.onclick = function() { window.history.back(); setTimeout(function() { window.location=window.location.href + 'closeapp'; }, 400);  };
      var titleContainer = document.createElement('Div');
      titleContainer.innerHTML = 'Busca la prenda'; 
      titleContainer.style = 'font-size: 15px; font-family: Arial, Helvetica, sans-serif; text-align: center; margin-top: -23px;';
      topContainer.appendChild(titleContainer);
      var button = document.createElement('Button'); 
      button.innerHTML = 'Añadir | <img style = 'width: 20px; line-height: 5px !important; position: absolute; margin-left: 10px; margin-top: -2px;' src="${this.logo}">'; 
      button.style = 'font-size: 13px; font-family: Arial, Helvetica, sans-serif; bottom:15px; width:140px; left: 34%; text-align: center; position: fixed; color: #fff; background-color: #000; height: 35px; border-radius: 10px; z-index: 999999;'; 
      arrowContainer.appendChild(button); 
      button.onclick = function() { window.location=window.location.href + 'closeapp'; };`;
      
      
   
    let codeData = `var toolbar = document.createElement('Div');
    toolbar.style = 'bottom:0; width: 100%; height: 65px; background-color: white; border-top: 1px solid #f4f4f4; position: fixed; z-index: 999999;';
    document.body.appendChild(toolbar);
    var arrowContainer = document.createElement('Div');
    arrowContainer.style = 'width: 100%; height :100%;';
    toolbar.appendChild(arrowContainer);
    var arrowButtonLeft = document.createElement('I');
    arrowButtonLeft.style = 'border-style: solid; border-color: black; border-width: 0px 4px 4px 0px; display: inline-block; padding: 6px; transform: rotate(135deg); -webkit-transform: rotate(135deg); margin-top: 25px; margin-left: 20px;'; 
    arrowContainer.appendChild(arrowButtonLeft);
    arrowButtonLeft.onclick = function() { window.history.back(); };
    var arrowButtonRight = document.createElement('I');
    arrowButtonRight.style = 'border-style: solid; border-color: black; border-width: 0px 4px 4px 0px; display: inline-block; padding: 6px; transform: rotate(-45deg); -webkit-transform: rotate(-45deg); margin-top: 25px; margin-left: 40px;'; 
    arrowContainer.appendChild(arrowButtonRight);
    arrowButtonRight.onclick = function() { window.history.forward(); };
    var topbar = document.createElement('Div');
    topbar.style = 'height: 60px; background-color: white; position: fixed; top: 0; width :100%; border-bottom: 1px solid #f4f4f4; z-index: 999999;';
    document.body.appendChild(topbar);
    var topContainer = document.createElement('Div');
    topContainer.style = 'width: 100%; height :100%;';
    topbar.appendChild(topContainer);
    ${pageData}`;
    browser.executeScript({
      code: codeData
    });
    browser.insertCSS({ 
      code: "body { position: absolute; top: 60px; height: 73%; width: 100%; } header, header.header-container { top: 60px !important;}" 
    });
  });

     }


  testMeta(productLink){
    return new Promise((resolve, reject) => {
      this.myzuraAPI.getMetaTagsAPI(productLink).then(async r=>{
        r=r.result;
        this.gender = this.getGenderFromURL(productLink)
        let photos = [];
        if(r.image){
             photos["64"] = r.image
            photos["128"] = r.image
            photos["256"] = r.image
            photos["full"] = r.image
        }
        let product =			{
            name:this.capitalize_Words(r.title),
            description:this.capitalize_Words( r.description),
            shop_url: this.productLink,
            affiliate_url: "",
            brand: this.capitalize_Words( r.name),
            price: '',
            oldPrice: "",
            currency:'',
            //   reviews: response.id,
            additionalProperty:null,
            gender: this.gender,
            category: '',
            body_category: '',
            photos:photos ,
            shop_photos: [] || null,
            availability:  '',
            //   colors: response.id,
            //   tags: response.id,
            //   average_smile_level: response.id,
            //   last_reviewed:response.id,
            last_updated:Date.now(),
            language: '',
            sku: '',
            reviewedByAdmin:false,
            postedBy: this.userId
          }
          resolve(product)
      }).catch((error) => {reject(error)})
    })
  }


  getProductByLink(link){
    return new Promise((resolve, reject) => {
      this.firebaseProvider.dataProvider.getProductByLink(link).query.once("value",r=>{
        console.log(r)
        if(r.val()){
          let data = Object.values(r.val())[0]
          data["id"]=Object.keys(r.val())[0]
          resolve(data)
        }else{
          resolve(null)
        }
      })
    })
  }

 async addToCloset(productLink){
   this.productLink=productLink;

    return new Promise((resolve, reject) => {
      this.slidePage  = 2
      this.loading = true
      this.found = false
      this.getProductByLink(productLink).then((product:any)=>{
        console.log(product)
        if(product){
          this.found = true;
          this.loading = false;
          this.product = product;
          this.productId = product.id;
          resolve(product)
        }else{
          this.testMeta(productLink).then((product)=>{
            this.found = false;
            this.loading = false;
            this.product = product;
            resolve(product)

            
          }).catch((error)=>{
            this.found = false;
            this.loading = false;
            this.slidePage = 1
            alert(this.translate.get("qrscanner.error.text"))
            resolve(error)

          })
  
        }
  
  
      })
    })
  }

  add(){
    this.loading2=true
    this.product.name = this.capitalize_Words(this.product.name)
    this.firebaseProvider.dataProvider.getProductsRef().push(this.product).then((res:any)=>{
      this.product["id"] = res.getKey()
      
      try {

        let params =  {
        "gender" :  this.gender.toUpperCase(),
        "brand" :this.product.brand.toUpperCase(),
        "category" :this.category
      }
        this.myzuraAPI.getBodyCategory(params).then(async (res:any)=>{
          let params =  {
            "userId" :  this.userId,
            "link" :  this.productLink,
            "gender" :  this.gender,
            "category" :this.category,
            "bodyCategory" :res.result || "" ,
            "brand" :this.product.brand.toUpperCase(),
            "productId" :this.product["id"]
          }
          this.myzuraAPI.addProductLoop(params)
          setTimeout(()=>{
            this.loading2=false
            this.mixpanelService.setUserId(this.userId)
            this.mixpanelService.track("AddNewProduct", {
              product: this.product["id"],
              source: "QRPage",
              timestamp: Date.now()
            })
            this.modalCtrl.dismiss()
            this.alert.addReviewPopup();
          }, 3000)
          console.log(res)
        })
        
      
      } catch (error) {
        console.log(error)
      }



    })
  }

  capitalize_Words(str)
  {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
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
}


