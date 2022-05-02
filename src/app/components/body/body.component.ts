import { Component, OnInit, AfterViewInit, ViewChild, HostBinding, Input } from '@angular/core';

import { IonSlides, MenuController, NavController } from '@ionic/angular';
import { TranslateProvider } from 'src/app/services/translate.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginProvider } from 'src/app/services/login.provider';
import { MyZuraApiService } from 'src/app/services/myzura.api.service';
import { FirebaseProvider } from 'src/app/services/firebase.provider';
import { LoadingProvider } from 'src/app/services/loading.provider';
import { NotificationsService } from 'src/app/services/notifications.service';
import { MixpanelService } from 'src/app/services/mixpanel.service';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['body.component.scss']

})
export class BodyTypeComponent implements OnInit {
 
  @Input() userId;
  @Input() gender;
  @Input() selectedFirstBody?=''
  @Input() selectedSecondBody?=''
  @Input() params
  @Input() firstTime
  bodyTypesForm: FormGroup;
  bodyTypesForm2: FormGroup;
  bodyMeasuresForm: FormGroup;
  chestTypeForm: FormGroup;

  tabName ="bodyType";
  bodyTypes = {
    'male': {
      'A':[
        { value: 'A', image:'' }
      ],
      'B':[
        { value: 'B', image:'' }
      ],
      'C':[
        {value: 'C',  image:''}
      ]

    },
    'female': {
      'A':[
        { value: 'A1', image:'assets/images/body/female/semicurvy_hip_final2.png' },
        { value: 'A2', image:'assets/images/body/female/plain_hip_final2.png' },
      ],
      'B':[
        { value: 'B1', image:'assets/images/body/female/semicurvy_hip_final2.png' },
        { value: 'B2', image:'assets/images/body/female/plain_hip_final2.png' },
      ],
      'C':[
        { value: 'C1', image:'assets/images/body/female/courvy_hip_final2.png' },
        { value: 'C2', image:'assets/images/body/female/spoon_hip_final2.png' },
        { value: 'C3', image:'assets/images/body/female/triangle_hip_final2.png' },
      ]

    }

  };

  measures=[]


  femaleBodyTypes = {}
  maleBodyTypes = {}



  //chestTypes
  pechos = [
    "80",
    "85",
    "90",
    "95",
    "100",
    "105",
    "110",
    "115",
    "120",
    "125",
    "130",
    "135",
    "140",
    "145",
    "150",
    "155",
    "160",
    "165"
  ]

  copas = [
    "AAA",
    "AA",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S"
  ]
  constructor(public menu: MenuController,
    public translate: TranslateProvider,
    public navCtrl: NavController,
    public loginProvider: LoginProvider,
    public myzuraAPI: MyZuraApiService,
    public firebaseProvider: FirebaseProvider,
    public loadingProvider: LoadingProvider, 
    private mixpanelService: MixpanelService
    
    ) {
      for (var i = 40; i<160; i++){
        this.measures.push(i)
      }

      console.log('input', this.params)

      this.bodyTypesForm = new FormGroup({
        'type': new FormControl('', Validators.compose([
          Validators.required,
        //  Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ]))
      });
 

      this.bodyTypesForm2 = new FormGroup({
        'abdomen': new FormControl(3, Validators.compose([
          Validators.required,
        //  Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])),
        'bottom': new FormControl(3, Validators.compose([
          Validators.required,
        //  Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ]))
      });
       
       
      this.bodyMeasuresForm = new FormGroup({
        'buttockcircumference': new FormControl(null, Validators.compose([
          Validators.required,
        //  Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])),
        'chestcircumference': new FormControl(null, Validators.compose([
          Validators.required,
        //  Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])),
        // 'crotchheight': new FormControl(0, Validators.compose([
        //   Validators.required,
        // //  Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        // ])),
        'insideleg': new FormControl(null, Validators.compose([
          Validators.required,
        //  Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])),
        // 'lateralmalleolusheight': new FormControl(0, Validators.compose([
        //   Validators.required,
        // //  Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        // ])),
        'neckcircumference': new FormControl(null, Validators.compose([
          Validators.required,
        //  Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])),
        'sleeveoutseam': new FormControl(null, Validators.compose([
          Validators.required,
        //  Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])),
        'waistcircumference': new FormControl(null, Validators.compose([
          Validators.required,
        //  Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ]))
      });

      this.chestTypeForm = new FormGroup({
        'sizesContinent': new FormControl('es', Validators.compose([
          Validators.required,
        //  Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])),
        'cup': new FormControl('', Validators.compose([
          Validators.required,
        //  Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])),
        'chest': new FormControl('', Validators.compose([
          Validators.required,
        //  Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ]))
      });
      

   }

  ngOnInit(): void {
    // this.slides.lockSwipes(true);
    this.firebaseProvider.dataProvider.getDefaultBodyTypeData().query.once("value", snapshot=>{
      let data = snapshot.val()
      this.femaleBodyTypes = data.female;
      this.maleBodyTypes = data.male;
      
      console.log(snapshot.val())
    })

    this.mixpanelService.setUserId(this.userId)

  }

  selectCopa(copa){
    this.chestTypeForm.patchValue({
      cup:copa
    })
  }

  selectChest(chest){
    this.chestTypeForm.patchValue({
      chest:chest
    })
  }
  getImageIndex(){
    let abdomen = this.bodyTypesForm2.controls.abdomen.value
    let bottom = this.bodyTypesForm2.controls.bottom.value

    console.log(abdomen, bottom)

    return "" + abdomen + bottom

  }

  async completeBody(){
    // this.params['bodyType'] = this.bodyTypesForm.controls.type.value

    // delete this.params['bmi'] 
    // delete this.params['age'] 
    // delete this.params['bfp'] 
    await  this._postBodyMeasures()
    console.log(this.params)
    this.loginProvider.addBody(this.userId, this.params, this.firstTime)
  }

  goToType(){
    this.mixpanelService.track("setBodyType", {
      gender: this.gender,
      timestamp: Date.now()
    })
    this.tabName ="bodyType2"
  }
  addBody(){
    console.log(this.firstTime)


    

    switch (this.gender) {
      case "male":
        this.completeBody()
        break;
      case "female":
        this.tabName="chestType"
        break;
      case "other":
        this.addManualBodyMeasures()
        break;
      default:
        break;
    }

    if(this.gender=='female'){
      // this.completeBody();
    }else{
      // this.c()
    }
    this.mixpanelService.track("setBodyTypePart2", {
      gender: this.gender,
      timestamp: Date.now()
    })
  }

 async doneFemale(){
    await  this._postBodyMeasures()
    console.log(this.params)
    this.loginProvider.addBody(this.userId, this.params, this.firstTime)

    this.mixpanelService.track("setChestSize", {
      gender: this.gender,
      timestamp: Date.now()
    })
  }
  setFirstBodyType(body){
    this.selectedFirstBody = body
  }


  tryCatch(f){
    try {
      f
    } catch (error) {
      console.log(error)
    }
  }
  _postBodyMeasures(){
    this.params['user_id'] = this.userId

    console.log(this.params)
    let age = this._calculateAge(new Date(this.params.birthDate.split('T')[0]))
    let bmi = this._calculatBmi(this.params.height, this.params.weight)
    let bfp = this._calculatBfp(age,this.params.gender, bmi)


    //GENDER=MALE
    let bodyType = 0
    
    if(this.params.gender == 'male'){
      bodyType = this._calculateMaleBodyType(bmi)
      this.params['chestType'] =  this.bodyTypesForm.controls.type.value
    }else{
      bodyType = this.bodyTypesForm.controls.type.value
      this.params['chestType'] =  "" + this.chestTypeForm.controls.chest.value +  this.chestTypeForm.controls.cup.value

    }
    this.params['waistType'] =  this.bodyTypesForm2.controls.abdomen.value
    this.params['hipType'] =  this.bodyTypesForm2.controls.bottom.value

    this.params['age'] = age
    this.params['bmi'] = bmi
    this.params['bfp'] = bfp
    this.params['bodyType'] = bodyType
    this.params['height'] =  this.params['height']
    this.params['weight'] =  this.params['weight']
    this.loadingProvider.showLoading()

    this.myzuraAPI.postUserBodyMeasures(this.params).then(res=>{
      // this.myzuraAPI.postUserBodySizes({user_id: this.userId}) //MAYBE NOT NEEDED?
     try {

      if(this.firstTime){
        // this.notification.setToken(this.userId)
        this.tryCatch(this.myzuraAPI.generateUserClothingSizes({user_id: this.userId}))
        this.tryCatch(this.myzuraAPI.postKmeans({user_id: this.userId, sex:this.params.gender, body_type: this.params.bodyType , my_height: this.params.height, my_weight:this.params.weight}))
        // this.tryCatch(this.myzuraAPI.generateClosetRecommendations({user_id: this.userId}).then(r=>{
          this.myzuraAPI.generateMarketplaceRecommendations({user_id: this.userId})
        // }))
        
        this.tryCatch(this.myzuraAPI.generateExploreRecommendations({user_id: this.userId}))
        
        this.loadingProvider.hideLoading()

        this.navCtrl.navigateForward('auth/register/suggests')

      }else{
        this.tryCatch(this.myzuraAPI.generateUserClothingSizes({user_id: this.userId}))
        this.tryCatch(this.myzuraAPI.postKmeans({user_id: this.userId, sex:this.params.gender, body_type: this.params.bodyType , my_height: this.params.height, my_weight:this.params.weight}))
        this.tryCatch(this.myzuraAPI.generateMarketplaceRecommendations({user_id: this.userId}))
        this.tryCatch(this.myzuraAPI.generateExploreRecommendations({user_id: this.userId}))

        this.loadingProvider.hideLoading()

        this.navCtrl.back();

      }
      this.firebaseProvider.dataProvider.
      getUserRef(this.userId).update({
        addedBodySizes: true
      });
     } catch (error) {
      this.loadingProvider.hideLoading()

      if(this.firstTime){
 
        this.navCtrl.navigateForward('auth/register/suggests')

      }else{
 
        this.navCtrl.back();

      }
     }
    
    })
  }

  setSecondBodyType(body){
    this.selectedSecondBody = body
    switch(body){
      case 'A1':
        this.bodyTypesForm.patchValue({
          type:1
        })
        break;
      case 'A2':
      this.bodyTypesForm.patchValue({
        type:2
      })
      break;
      case 'B1':
        this.bodyTypesForm.patchValue({
          type:3
        })
        break;
      case 'B2':
        this.bodyTypesForm.patchValue({
          type:4
        })
        break;
      case 'C1':
      this.bodyTypesForm.patchValue({
        type:5
      })
      break;
      case 'C2':
        this.bodyTypesForm.patchValue({
          type:6
        })
        break;
      case 'C3':
        this.bodyTypesForm.patchValue({
          type:7
        })
        break;
    }
    console.log(this.bodyTypesForm.controls.type.value)
  }

  setMaleBodyType(body){
    this.selectedFirstBody = body
    switch(body){
      case 'A':
        this.bodyTypesForm.patchValue({
          type:8
        })
        break;
      case 'B':
      this.bodyTypesForm.patchValue({
        type:9
      })
      break;
      case 'C':
        this.bodyTypesForm.patchValue({
          type:10
        })
        break;
      
    }

    console.log(this.bodyTypesForm.controls.type.value)
  }
 

_calculateMaleBodyType(bmi){
  
  if(bmi<=26.7){
    
    return(1)
  }
  
  if(bmi<=25){
    
    return(2)
    
    
  }
  
  if(bmi>=22 && bmi <=30){
    
    return(3)
    
  }
  
  if(bmi>=25 && bmi <=32.7){
    
    return(4)
    
  }
  
  if(bmi>30 && bmi <=35){
    
    return(5)
    
    
  }
  
  if(bmi>35){
    return(6)
  }
  return(-1)
}
 _calculateAge(birthday) { // birthday is a date
    console.log(birthday)
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

_calculatBmi(height, weight) { // birthday is a date
   
    return weight / ((height/100)**2); // divided by 100 cm -to meters
}


_calculatBfp(age, gender, bmi) { // birthday is a date
    let bfp=0
    if(gender=='male'){
        bfp = (1.20*bmi)+(0.23*age)-(10.8*1)-5.4 
    }else{
        bfp = (1.20*bmi)+(0.23*age)-(10.8*0)-5.4 
    }
    return bfp;
}

  addManualBodyMeasures(){
    
    if(this.params.gender == 'other'){
      this.params['userId'] = this.userId

      console.log(this.params)
      let age = this._calculateAge(new Date(this.params.birthDate.split('T')[0]))
      let bmi = this._calculatBmi(this.params.height, this.params.weight)
      // let bfp = this._calculatBfp(age,this.params.gender, bmi)
  
  
      //GENDER=MALE
      let bodyType = 0
      
      // if(this.params.gender == 'male'){
      //   bodyType = this._calculateMaleBodyType(bmi)
      // }else{
      //   bodyType = this.bodyTypesForm.controls.type.value;
      // }
  
      this.params['age'] = age
      // this.params['bmi'] = bmi
      // this.params['bfp'] = bfp
      // this.params['bodyType'] = bodyType
  
      let body = {
        age:age,
        bfp:0,
        birthDate:this.params.birthDate,
        bmi: bmi,
        waistType:0,
        hipType:0,
        chestType:0,
        bodyType: 0,
        gender: this.params.gender,
        height: this.params.height,
        userId: this.userId,
        weight: this.params.weight
        
      }

      this.loadingProvider.showLoading()

      this.addManualUserBodyMeasures(body).then(()=>{
        // this.myzuraAPI.postUserBodySizes({user_id: this.userId}) //MAYBE NOT NEEDED?
       try {
  
        if(this.firstTime){
          this.myzuraAPI.generateUserClothingSizes({user_id: this.userId})
          // this.myzuraAPI.postKmeans({user_id: this.userId, sex:this.params.gender, body_type: this.params.bodyType , my_height: this.params.height, my_weight:this.params.weight})
          // this.myzuraAPI.generateClosetRecommendations({user_id: this.userId}).then(r=>{
            this.myzuraAPI.generateMarketplaceRecommendations({user_id: this.userId})
          // })
         
          this.myzuraAPI.generateExploreRecommendations({user_id: this.userId})
          this.loadingProvider.hideLoading()
          this.navCtrl.navigateForward('auth/register/suggests')
        }else{
          this.loadingProvider.hideLoading()
          this.navCtrl.navigateForward('tabs/profile');
        }
       } catch (error) {
         
       }
      
      })
    }else{
      this.addBody() //male female
    }
   

  }
  addManualUserBodyMeasures(body){
    return new Promise(async (resolve, reject) => {
      console.log(this.bodyMeasuresForm.getRawValue())
      await this.firebaseProvider.updateUserBodyMeasures(body, this.bodyMeasuresForm.getRawValue(), this.userId)
      resolve([])
    })
  }
 
}
