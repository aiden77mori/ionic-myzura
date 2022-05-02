import { Component, OnInit, AfterViewInit, ViewChild, HostBinding, Input } from '@angular/core';

import { IonSlides, MenuController, NavController } from '@ionic/angular';
import { TranslateProvider } from 'src/app/services/translate.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginProvider } from 'src/app/services/login.provider';
import { ActivatedRoute } from '@angular/router';
import { DataProvider } from 'src/app/services/data.provider';
import { MixpanelService } from 'src/app/services/mixpanel.service';
import { GlobalDataService } from 'src/app/services/global.data.service';
import { MyZuraApiService } from 'src/app/services/myzura.api.service';

@Component({
  selector: 'app-shoes-profile',
  templateUrl: './shoes.page.html',
  styleUrls: ['shoes.page.scss']

})
export class ShoesProfilePage implements OnInit {

  user:any

  
  step ='type'
  @Input() userId=''

  shoesForm : FormGroup;
  validation_messages = {
    'brand': [
      { type: 'required', message: 'brand is required.' }
 //   ,  { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'shoeSize': [
      { type: 'required', message: 'size is required.' }
 //   ,  { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'feetSize': [
      { type: 'required', message: 'Feet size is required.' }
      ,  { type: 'min', message: 'Minimum is 20cm' }
      ,  { type: 'max', message: 'Maximum is 45cm' }
    ],
   }
brands = []
shoeSizes = []
constructor(
    public mixpanelService: MixpanelService,
    public translate: TranslateProvider,
    public loginProvider: LoginProvider,
    private globalData:  GlobalDataService,
    private myzuraAPI: MyZuraApiService,
    private dataProvider:  DataProvider,
    private arouter: ActivatedRoute,

    public navCtrl: NavController

                            
    ) {

      for (var i = 34; i<54; i++){
        this.shoeSizes.push(i)
      }
      this.globalData.BRANDS().then(brands=>{
        this.brands = brands.sort(function(a, b) {
              var textA = a.name.toUpperCase();
              var textB = b.name.toUpperCase();
              return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
          });
       })
      this.shoesForm = new FormGroup({
        'brand': new FormControl(null, Validators.compose([
          Validators.required,
        //  Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])),
        'shoeSize': new FormControl(null, Validators.compose([
          Validators.required,
        //  Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])),
        'feetSize': new FormControl(null, Validators.compose([
          Validators.required,
          Validators.min(20),
          Validators.max(45),
        //  Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ]))
      });

   }


   ionViewDidEnter() {
     console.log(this.userId)
   }
  ngOnInit(): void {
    this.arouter.queryParams.subscribe(params => {
      console.log(params)
      if (params && params.userId) {
        // alert(1)
        this.userId=params.userId

      }
    });
    // this.slides.lockSwipes(true);
    // this.menu.enable(false);
  }

  back() {

    this.navCtrl.back();
  }



  saveFeet(){

    let size  = this.shoesForm.controls.feetSize.value.toString().replace(/,/g, '.')
    try {
      this.myzuraAPI.getFootSizeByUserData(
        {
          "user_id" : this.userId,
          "method" : "direct",
          "brand" : "",
          "value" :  (parseFloat(size)*10).toString()        
        }
      ).then(res=>{
        console.log(res)
        this.navCtrl.navigateForward('tabs/profile');

      })
    } catch (error) {
      this.navCtrl.navigateForward('tabs/profile');

    }
    console.log(parseFloat(size))
  }


    saveBrand(){
      try {
        this.myzuraAPI.getFootSizeByUserData(
          {
            "user_id" : this.userId,
            "method" : "inverse",
            "brand" : this.shoesForm.controls.brand.value,
            "value" : this.shoesForm.controls.shoeSize.value.toString(),
          }
        ).then(res=>{
          console.log(res)
          this.navCtrl.navigateForward('tabs/profile');

        })
      } catch (error) {
        this.navCtrl.navigateForward('tabs/profile');

      }
  }
}
