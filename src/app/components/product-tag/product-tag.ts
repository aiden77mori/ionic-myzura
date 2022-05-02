import { Component, OnInit, Input } from '@angular/core';
import { AlertController, ModalController, NavController} from '@ionic/angular';
import { DataProvider } from 'src/app/services/data.provider';
import { MyZuraClothingSizesService } from 'src/app/services/clothing.sizes';

 import { MixpanelService } from 'src/app/services/mixpanel.service';
import { BrowserService } from 'src/app/services/browser.service';
import { Sizes } from 'src/app/models/sizes.model';

@Component({
  selector: 'app-product-tag',
  templateUrl: './product-tag.html',
  styleUrls: ['./product-tag.scss'],
})
export class ProductTagComponent implements OnInit {


  @Input() type: any;
  @Input() addedBodySizes?: any;
  @Input() product: any;
  @Input() index: any;
  @Input() taggedProducts?: any;

  @Input() xPercent?:any;
  @Input() yPercent?:any;
  @Input() modal?:any;
  @Input() visitor?: boolean = false

  
  sizes: Sizes
  constructor(    
    public dataProvider: DataProvider,
    public clothingSizes: MyZuraClothingSizesService,
    public mixpanelService : MixpanelService,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    private browserService: BrowserService,
    private alertCtrl: AlertController
    ) { }

  ngOnInit() {
    console.log(this.product)
    try {
      let brand = this.product.brand
      let gender = this.product.gender
      let bodyCat=""
      // if(this.product.category !=""){
      //   if(this.product.category.includes(",")){
      //     bodyCat = this.product.body_category.split(",")[0]
      //     console.log("getting sizes",)

      //   }
      // }

      this.clothingSizes.getSizes(brand, gender, "EU", this.product.category).then((sizes:Sizes)=>{
        console.log(sizes)
        if(sizes){
          this.sizes = sizes
        }
      })
    
    } catch (error) {
      
    }

    
  }
  
 async openShopLink(link, productId){
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

    this.browserService.browseLink(link);
    // window.open(link, '_system', 'location=yes')

  }


  deleteTaggedProduct(){

    this.taggedProducts.splice(this.index, 1);

    console.log(this.taggedProducts)
  }




 async  tagProduct(){
    this.product['tagX']=this.xPercent
    this.product['tagY']=this.yPercent
    this.product['rating']=1
    this.product['tagColor']='#777'
    this.taggedProducts.push(this.product)

    console.log(this.taggedProducts)
    await  this.modal.dismiss();

  }
  async addClosetProduct(productId, productKey){
    this.mixpanelService.track("AddToCloset", {
      product: productId,
      source: "ProductTag",
      timestamp: Date.now()
    })
    await this.dataProvider.getCLosetRef().once('value',async (data:any)=>{
      let productIds=[]
      data = data.val()
      if(data){
       let dataAux:any = Object.values(data)
       dataAux.forEach(product => {
          productIds.push(product.productId)
        });

       
      }
      if(!productIds.includes(productId)){
        await this.dataProvider.getCLosetList().push({
          productId: productId,
          timestamp: Date.now()
        })

        //AFTER ADDING IT WE CAN REMOVE IT:)
        this.dataProvider.deleteCLosetPlusListProductById(productKey)

      }
   
    })
      
    }  

  async deleteClosetPlusProduct(productKey){
    this.mixpanelService.track("DeleteClosetPlus", {
      // product: productId,
      source: "ProductTag",
      timestamp: Date.now()
    })
      const alert = await this.alertCtrl.create({
        header: 'Confirm Delete',
        message: 'Are you sure you want to delete this product? This cannot be undone.',
        buttons: [
          {
            text: 'Cancel'
          },
          {
            text: 'Delete',
            handler: data => {
              this.dataProvider.deleteCLosetPlusListProductById(productKey)

            }
          }
        ]
      });
      alert.present();
    
  }


  async deleteClosetProduct(productKey){
    this.mixpanelService.track("DeleteCloset", {
      // product: productId,
      source: "ProductTag",
      timestamp: Date.now()
    })
    const alert = await this.alertCtrl.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this product? This cannot be undone.',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Delete',
          handler: async data => {
            this.dataProvider.deleteCLosetListProductById(productKey)
            try {
              await  this.modalCtrl.dismiss();
            } catch (error) {
              
            }
          }
        }
      ]
    });
    alert.present();
  
}
  logRatingChange(e){
    this.product.rating =e
    console.log(e)
  }


 async gotoDetails(id){
  this.mixpanelService.track("ProductDetails", {
    product: id,
    source: "ProductTag",
    timestamp: Date.now()
  })
  
   try {
    await  this.modalCtrl.dismiss();

   } catch (error) {
     console.log(error)
   }
    this.navCtrl.navigateForward('tabs/product-details/'+id)
  }

  async closeModal(){
    await  this.modal.dismiss();

  }
  async gotoDetailsFound(id){
    this.mixpanelService.track("ProductDetails", {
      product: id,
      source: "ProductTag",
      timestamp: Date.now()
    })
    console.log("nAVIGATINGS")
     this.navCtrl.navigateForward('tabs/product-details/'+id)
   }

 getRating(product){
   if(!product.rating){
     if(product.overallRating){
       return product.overallRating
     }else{
       return 5;
     }
   }else{
    return product.rating
   }
 }

 addSizes(){
   this.modalCtrl.dismiss()
   this.navCtrl.navigateRoot('/tabs/profile/settings')
 }
}
