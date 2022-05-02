import { Component, OnInit, AfterViewInit, ViewChild, HostBinding } from '@angular/core';

import { IonSlides, LoadingController, MenuController, NavController, Platform } from '@ionic/angular';
import { TranslateProvider } from 'src/app/services/translate.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { LoginProvider } from 'src/app/services/login.provider';
import { ActivatedRoute, Router } from '@angular/router';
import { MixpanelService } from 'src/app/services/mixpanel.service';
import { DataProvider } from 'src/app/services/data.provider';
import { GlobalDataService } from 'src/app/services/global.data.service';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { take } from 'rxjs/operators';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { MyZuraApiService } from 'src/app/services/myzura.api.service';
declare var html2canvas;


@Component({
  selector: 'app-add-outfit',
  templateUrl: './add-outfit.page.html',
  styleUrls: ['add-outfit.page.scss']

})
export class AddOutfitPage implements OnInit {
 
  step = "buildOutfit"
  userId=""
  selectedCat = ""
  outfitForm: FormGroup;

  validation_messages = {
    'name': [
      { type: 'required', message: 'name is required.' }
 //   ,  { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'image': [
      { type: 'required', message: 'image is required.' }
 //   ,  { type: 'pattern', message: 'Enter a valid email.' }
    ],

  };





  categoryList = []
  closetList = {}
  products =[]

  draggables={}
  selectedId = ""
  showOptions =false;

  name=""


  initialPosition = { x: 100, y: 100 };
  position = { ...this.initialPosition };
  offset = { x: 0, y: 0 };

  constructor(public menu: MenuController,
    public translate: TranslateProvider,
    public loginProvider: LoginProvider,
    private loadingCtrl: LoadingController,
    private router: Router,
    public platform: Platform,
    public mixpanelService: MixpanelService,
    public navCtrl: NavController,
    public dataProvider: DataProvider,
    private myzuraApi: MyZuraApiService
    
    ) {
      this.outfitForm = new FormGroup({
      
        'name': new FormControl('', Validators.compose([
          Validators.required,
        //  Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])),
        'image': new FormControl('', Validators.compose([
          Validators.required,
        //  Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ]))
      });


    //   this.categoryList = this.globalData.CATEGORIES.sort(function(a, b) {
    //     var textA = a.name.toUpperCase();
    //     var textB = b.name.toUpperCase();
    //     return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    // });

   }
   ionViewWillLoad(){
     this.step = "buildOutfit"
   }

   async getCloset(){
    await this.dataProvider.getCLoset().valueChanges().subscribe((data:any,)=>{
      if(data){

        //very important to keep key
      let dataAux:any = Object.entries(data)
       dataAux = dataAux.reverse()  
        this.getClosetData(dataAux).then((closetData:any)=>{
          this.categoryList = _.uniq(_.map(closetData, "category"))
          this.closetList = {}
          this.categoryList.forEach(c=>{
            this.closetList[c] = {
              name:c,
              photo:"",
              total:0,
              products:[]
            }
          })

          closetData.forEach(d=>{
            if(!this.closetList[d.category].photo){
              this.closetList[d.category].photo = d.photos[256]
            }
            this.closetList[d.category].products.push(d) 
            this.closetList[d.category].total +=1 
          })
          this.sel_cat(this.categoryList[0] )

          console.log((this.closetList))
        })
      }

    })
  }

  getProductByClosetProduct(product){
    return new Promise((resolve, reject)=>{
      this.dataProvider.getProductById(product[1].productId ).query.once("value",(snapshot)=>{
        let productData ={}

        if(snapshot){
          snapshot.forEach(snap => {
            productData[snap.key] = snap.val();
          });
          resolve({...productData, key: product[0] })
        }else{
          resolve({key: product[0] })

        }
       })
    })
  }
  getClosetData(products){
    let closetData =[]
    return new Promise(async (resolve, reject)=>{
     for(var i=0; i<products.length; i++){
       await this.getProductByClosetProduct(products[i]).then(p => {
        closetData.push(p)
       })
     }
     resolve(closetData)
    })
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
   sel_cat(cat){
    this.selectedCat = cat

    this.products = this.closetList[cat].products
   }
  ngOnInit(): void {
    this.dataProvider.getCurrentUser().pipe(take(1)).subscribe((user:any) => {
      this.userId = user.userId


    });
    // this.slides.lockSwipes(true);
    this.getCloset()
  }


  checkUsername(username){
    return new Promise((resolve, reject) => {
      this.dataProvider.getDefaultUsernames().query.once("value", unames=>{
        let data = unames.val()
        
        if(!data){
          data = []
        }
        if(!data.includes(username)){
          data.push(username)
          this.dataProvider.getDefaultUsernames().set(data)
          resolve(false)

        }else{
          resolve(true)
        }
      })
    })
 
  }
 

  // addProfile(){
  //     if(!this.usernameCheck || !this.checkSpace()){
  //       this.mixpanelService.setUserId(this.userId)
  //       this.mixpanelService.track("Create-Profile", {
  //         timestamp: Date.now()
  //       });

  //       console.log(this.bodyMeasuresForm.controls.gender.value.toLowerCase())
  //       this.loginProvider.addProfile(
  //         this.userId, 
  //         this.capitalize_Words(this.profileForm.controls.name.value),  
  //         this.profileForm.controls.username.value.toLowerCase(),  
  //         this.profileForm.controls.birthDate.value.toLowerCase(),  
  //       this.bodyMeasuresForm.controls.gender.value.toLowerCase());

  //       this.navCtrl.navigateForward('auth/register/suggests')
  //       // this.onSlideNext();
  //     }

  // }
  //capitalize_Words 
  capitalize_Words(str)
  {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }


  // addBodyMeasures(){
  //   this.params={
  //   //  userId: this.userId,
  //    height: this.bodyMeasuresForm.controls.height.value,
  //    weight: this.bodyMeasuresForm.controls.weight.value, 
  //    gender: this.bodyMeasuresForm.controls.gender.value,
  //    birthDate: this.profileForm.controls.birthDate.value,
  //   //  bodyType: this.bodyTypesForm.controls.bodyType.value,

  //   }

  //   this.currentSlide ='bodyType'

  //   // this.loginProvider.addBodyMeasures(this.userId, this.bodyMeasuresForm.controls.height.value,  
  //   //   this.bodyMeasuresForm.controls.weight.value,  this.bodyMeasuresForm.controls.gender.value,
      
  //   //   )
  // }

  back() {
    this.navCtrl.back();
  }

  setName(){
    this.step="setName"
    this.capture()
  }


  getImageBase64(image){
    return new Promise((resolve, reject) => {
      this.myzuraApi.imageToBase64({imgUrl:image}).then((res:any)=>{
        console.log(res)

        resolve(res.base64)
      })
    })
  }
  async addItem(item){
    let loading = await this.loadingCtrl.create({
      spinner: 'circles'
    });

    loading.present();
    let id=uuidv4();
    this.draggables[id]={
      id: id,
      width:90,
      photo: await this.getImageBase64(item.photos["full"]), //change no-bg
      showOptions: false,
      x:this.initialPosition.x,
      y:this.initialPosition.y
    }
    loading.dismiss()
    console.log(this.draggables)
  }

  dupItem(){
    let id=uuidv4();
    this.draggables[id]= {
      id: id,
      width:this.draggables[this.selectedId].width,
      photo: this.draggables[this.selectedId].photo,
      showOptions: false,
      x:this.initialPosition.x,
      y:this.initialPosition.y
    }
  }


  removeItem(){
    delete this.draggables[this.selectedId]
  }

  zoomIn(){
    this.draggables[this.selectedId].width +=10 
    console.log(this.draggables)
  }


  zoomOut(){
    if(this.draggables[this.selectedId].width!=0){
      this.draggables[this.selectedId].width -=10 
    }
  }

  getKeys(obj){
    return(Object.keys(obj))
  }


  async save(){  
    let loading = await this.loadingCtrl.create({
      spinner: 'circles'
    });

    loading.present();  
    this.dataProvider.angularDb.list("outfits/"+ this.userId).push({
      name:this.outfitForm.controls.name.value, 
      outfit: JSON.stringify(this.draggables),
      image: this.outfitForm.controls.image.value, 
      dateCreated: Date.now()
    }).then(res=>{
      loading.dismiss()
      this.router.navigateByUrl('tabs/outfits')
    })
  }

  dragEnd(event: CdkDragEnd, id) {
    this.offset = { ...(<any>event.source._dragRef)._passiveTransform };

    this.draggables[id].x = this.offset.x
    this.draggables[id].y = this.offset.y

  }

  toDataURL = async (url) => {
    console.log("Downloading image...");
    var res = await fetch(url);
    var blob = await res.blob();

    const result = await new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.addEventListener("load", function () {
        resolve(reader.result);
      }, false);

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    })

    return result
  };

  capture(){
    Array.from(document.getElementsByClassName('animacionDiv')).map(el=>{
      el.classList.remove('fadeInUp')
      el.classList.remove('animated') 
  })   
    
    let outfit = document.getElementById("outfit");
    html2canvas(
      outfit
    ,{ 
      scale: 4,
      width: outfit.offsetWidth,
      height: this.platform.width(),
      letterRendering: 1, 
      // backgroundColor: null,
      allowTaint : true, 
      // useCORS: true
    }
    ).then(canvas => {
      this.outfitForm.patchValue({
        image: canvas.toDataURL()
      }) 
    //   var images = [
    //     { src: canvas.toDataURL(), x: 0, y: 0 },
    //     { src: canvas.toDataURL(), x: 20, y: 20 },
    //  ];
     
    //  var canvasNew = document.createElement('canvas');
    //  var destination = document.getElementById('canvas');
     
    //  Promise.all(images.map(imageObj => add2canvas(canvasNew, imageObj)))
    //      .then(() => destination.append(canvas));
     
    //  function add2canvas(canvas, imageObj) {
    //     return new Promise( (resolve, reject) => {
    //        if (!imageObj || typeof imageObj != 'object') return reject();
    //        var image = new Image();
    //        image.onload = function () {
    //            canvas.getContext('2d')
    //                  .drawImage(this, imageObj.x || 0, imageObj.y || 0);
    //            resolve([]);
    //        };
    //        console.log()
    //        image.src = imageObj.src;
    //     });
    //  }
    });

  }
  showOptionsPanel(i){
    this.showOptions=!this.showOptions; 
    this.selectedId = i
    console.log(this.showOptions, this.selectedId)
  }
}