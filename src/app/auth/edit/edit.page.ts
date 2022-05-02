import { Component, OnInit, AfterViewInit, ViewChild, HostBinding, Input } from '@angular/core';

import { IonSlides, MenuController, NavController } from '@ionic/angular';
import { TranslateProvider } from 'src/app/services/translate.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { LoginProvider } from 'src/app/services/login.provider';
import { ActivatedRoute } from '@angular/router';
import { DataProvider } from 'src/app/services/data.provider';
import { MixpanelService } from 'src/app/services/mixpanel.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit.page.html',
  styleUrls: ['edit.page.scss']

})
export class EditProfilePage implements OnInit {
  @ViewChild(IonSlides, { static: true }) slides: IonSlides;

  slidesOptions: any = {
    zoom: {
      toggle: false // Disable zooming to prevent weird double tap zomming on slide images
    },
    allowTouchMove: false, //disable swipe with touch
    onlyExternal: true

  };

  slider_list:any=[];
  user:any
  profileForm: FormGroup;
  bodyMeasuresForm: FormGroup;
  bodyTypesForm: FormGroup;
  validation_messages = {
    'username': [
      { type: 'required', message: 'Username is required.' }
 //   ,  { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'name': [
      { type: 'required', message: 'Full Name is required.' }
 //   ,  { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'birthDate': [
      { type: 'required', message: 'BirthDate is required.' }
 //   ,  { type: 'pattern', message: 'Enter a valid email.' }
    ],

  };

  currentSlide ='bodyMeasures'
  @Input() userId=''


  params={}

  heights=[]
  weights=[]
  usernameCheck = false;

  constructor(
    public mixpanelService: MixpanelService,
    public translate: TranslateProvider,
    public loginProvider: LoginProvider,
    private dataProvider:  DataProvider,
    private arouter: ActivatedRoute,

    public navCtrl: NavController

                            
    ) {

      for (var i = 40; i<250; i++){
        this.heights.push(i)
        this.weights.push(i)
      }


      this.bodyMeasuresForm = new FormGroup({
        'gender': new FormControl('female', Validators.compose([
          Validators.required,
        //  Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])),
        'height': new FormControl(180, Validators.compose([
          Validators.required,
        //  Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])),
        'weight': new FormControl(70, Validators.compose([
          Validators.required,
        //  Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ]))
      });

      console.log(this.userId)
      this.dataProvider.getCurrentUser().subscribe((user:any) => {

        this.user = user;
        this.userId = user.userId
        this.bodyMeasuresForm.patchValue({
          'gender': user.userBody.gender,
          'height':parseInt(user.userBody.height),
          'weight':parseInt(user.userBody.weight),
        })
        console.log(this.user)
      });


    this.slider_list=[
      { title: this.translate.get('slide1.title'),description:this.translate.get('slide1.description'),img_url:"assets/images/register/1.png" },
      { title:  this.translate.get('slide2.title'),description:this.translate.get('slide2.description'),img_url:"assets/images/register/2.png" },
      { title: this.translate.get('slide3.title'),description:this.translate.get('slide3.description'),img_url:"assets/images/register/3.png" },
      { title: this.translate.get('slide4.title'),description:this.translate.get('slide4.description'),img_url:"assets/images/register/4.png" },
    ]
   }


  //  ionViewDidEnter() {
  //    console.log(this.userId)
  //  }
  ngOnInit(): void {
    console.log(this.userId)

    // this.slides.lockSwipes(true);
    // this.menu.enable(false);
  }

  onSlideNext() {
    // this.slides.lockSwipes(false);
    this.slides.slideNext(1000, false);
    // this.slides.lockSwipes(true);

  }

  checkUsername(username){
    // [disabled]="!profileForm.valid || this.usernameCheck || checkSpace()"  
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

  check(){
    this.checkUsername(this.profileForm.controls.username.value.toLowerCase()).then((result) =>{
      if(!result){
        this.usernameCheck = false;
      }else{
        this.usernameCheck = true;
      }
    })

  }

  checkSpace(){
    return this.profileForm.controls.username.value.indexOf(' ') >= 0;
  }

  addProfile(){
      if(!this.usernameCheck || !this.checkSpace()){
        this.mixpanelService.setUserId(this.userId)
        this.mixpanelService.track("Create-Profile", {
          timestamp: Date.now()
        });

        console.log(this.bodyMeasuresForm.controls.gender.value.toLowerCase())
        this.loginProvider.addProfile(
          this.userId, 
          this.capitalize_Words(this.profileForm.controls.name.value),  
          this.profileForm.controls.username.value.toLowerCase(),  
          this.profileForm.controls.birthDate.value.toLowerCase(),  
        this.bodyMeasuresForm.controls.gender.value.toLowerCase());

         this.currentSlide ='bodyMeasures'
        // this.onSlideNext();
      }

  }
  // addProfile(){
  //   this.loginProvider.addProfile(this.userId, this.capitalize_Words(this.profileForm.controls.name.value),  this.profileForm.controls.username.value.toLowerCase(),  this.profileForm.controls.birthDate.value);
  //   this.currentSlide ='bodyMeasures'
  // }
  //capitalize_Words 
  capitalize_Words(str)
  {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }


  addBodyMeasures(){
    this.params={
    //  userId: this.userId,
     height: this.bodyMeasuresForm.controls.height.value,
     weight: this.bodyMeasuresForm.controls.weight.value, 
     gender: this.bodyMeasuresForm.controls.gender.value,
     birthDate:this.user.birthDate,
    //  bodyType: this.bodyTypesForm.controls.bodyType.value,

    }

    this.currentSlide ='bodyType'

    // this.loginProvider.addBodyMeasures(this.userId, this.bodyMeasuresForm.controls.height.value,  
    //   this.bodyMeasuresForm.controls.weight.value,  this.bodyMeasuresForm.controls.gender.value,
      
    //   )
  }

  back() {
    this.navCtrl.back();
  }

  genderChanged(e){
    this.bodyMeasuresForm.patchValue({
      gender:e.detail.value
    })
    console.log(e.detail.value)
  }
}
