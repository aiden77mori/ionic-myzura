import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
 import countries from '../../util/countries';
import { Router } from '@angular/router';
// import { WebView } from '@ionic-native/ionic-webview/ngx';
// import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { LoginProvider } from '../../services/login.provider';
import { TranslateProvider } from 'src/app/services/translate.service';
import { MixpanelService } from 'src/app/services/mixpanel.service';
import { BrowserService } from 'src/app/services/browser.service';
 
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  styleUrls: ['signup.scss']
})
export class SignUpPage implements OnInit {

  public mode: string = 'login';
  public step = 1;
  public emailPasswordForm: FormGroup;
  public emailForm: FormGroup;
  countryCode: any = "+55";
  countries: any = countries;
  name: string = '';
  username: string = '';
  image: string = './assets/logo.png';
  defaultImg: string = './assets/logo.png';
  phone: any = '';

  signupForm: FormGroup;

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'email', message: 'Email is not correct.' }
 //   ,  { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 6 characters long.' },
      { type: 'match', message: 'Passwords do not match' },

    ],
    'confirmPassword': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 6 characters long.' },
      { type: 'match', message: 'Passwords do not match' },
      
    ]
  };

  // LoginPage
  // This is the page where the user can register and login to our app.
  // It's important to initialize the loginProvider here and setNavController as it will direct the routes of our app.
  constructor(
    private router: Router,
    public loginProvider: LoginProvider,
    public formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    private browserService: BrowserService,
    private navCtrl: NavController,
    public translate: TranslateProvider,
    public mixpanelService: MixpanelService,
    public camera: Camera,
    // private firebase: FirebaseX,
    // private webView: WebView
    ) {
    // It's important to hook the navController to our loginProvider.
    this.loginProvider.setNavController(this.router);
    // Create our forms and their validators based on validators set on validator.ts.

    this.signupForm = new FormGroup({
      'email': new FormControl('', Validators.compose([
        Validators.email,
        Validators.required,
      //  Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      'password': new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])),
      'confirmPassword': new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ]))
    });
    // this.emailPasswordForm = formBuilder.group({
    //   email: Validator.emailValidator,
    //   password: Validator.passwordValidator,
    //   phone: Validator.phoneValidator,
    //   countryCode: Validator.countryValidator
    // });
    // this.emailForm = formBuilder.group({
    //   email: Validator.emailValidator
    // });
  }

  ngOnInit() {
    // Set view mode to main.
    this.mode = 'login';
  }

  loadDefault(evt) {
    console.log(evt)
  }

  // Call loginProvider and login the user with email and password.
  // You may be wondering where the login function for Facebook and Google are.
  // They are called directly from the html markup via loginProvider.facebookLogin() and loginProvider.googleLogin().

  //select a photo
  async setPhoto() {
    // Ask if the user wants to take a photo or choose from photo gallery.
    let alert = await this.alertCtrl.create({
      header: 'Set Profile Photo',
      message: 'Do you want to take a photo or choose from your photo gallery?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Choose from Gallery',
          handler: () => {

            this.camera.getPicture({
              quality: 50,
              targetWidth: 384,
              targetHeight: 384,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType: this.camera.EncodingType.JPEG,
              correctOrientation: true,
              sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
            }).then((imageData) => {
              console.log(imageData);

              this.image = 'data:image/jpeg;base64,' + imageData;
            });
          }
        },
        {
          text: 'Take Photo',
          handler: () => {
            this.camera.getPicture({
              quality: 50,
              targetWidth: 384,
              targetHeight: 384,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType: this.camera.EncodingType.JPEG,
              correctOrientation: true,
              sourceType: this.camera.PictureSourceType.CAMERA
            }).then((imageData) => {
              console.log(imageData);

              this.image = 'data:image/jpeg;base64,' + imageData;
            });
          }
        }
      ]
    });
    alert.present();
  }

  // Call loginProvider and register the user with email and password.
  signup() {
    // const phone: string = this.countryCode + this.phone;
    // let img = this.image;
    // if (this.image.includes('assets')) {
    //   let c: any = <HTMLElement>document.createElement("canvas");
    //   let ctx: any = c.getContext('2d');
    //   let image = new Image(128, 128);
    //   // image.width = ;
    //   c.width = 128;
    //   c.height = 128;
    //   image.src = this.image;
    //   console.log('i.Width', image.width);
    //   console.log('i.Height', image.height);
    //   const width = 128;
    //   const height = 128;
    //   ctx.drawImage(image, 0, 0, width, height);
    //   img = ctx.canvas.toDataURL();
    // }

    const user = {
      // phone: phone,
      email: this.signupForm.controls.email.value,
      password: this.signupForm.controls.password.value,
      // image: img
    }
    this.mixpanelService.track("Sign-Up", {
      type:"email",
      timestamp: Date.now()
    })
    this.loginProvider.signup(this.signupForm.controls.email.value,  this.signupForm.controls.password.value);

    // console.log('newUser', user);

    // let self = this;
    // if (this.emailPasswordForm.value["phone"]) {
    //   // this.firebase.verifyPhoneNumber(async (credential: any) => {
    //   //   const { verificationId } = credential;
    //   //   let prompt = await self.alertCtrl.create({
    //   //     header: 'Enter the Confirmation code',
    //   //     inputs: [{ name: 'confirmationCode', placeholder: 'Confirmation Code' }],
    //   //     buttons: [
    //   //       {
    //   //         text: 'Cancel',
    //   //         handler: data => {
    //   //           console.log('Cancel clicked');
    //   //         }
    //   //       },
    //   //       {
    //   //         text: 'Send',
    //   //         handler: data => {
    //   //           this.loginProvider.registerByPhone(user, verificationId, data.confirmationCode);
    //   //         }
    //   //       }
    //   //     ]
    //   //   });
    //   //   prompt.present();
    //   // }, (err) => {
    //   //   console.log(err);
    //   // }, phone, 60);

    //   // (<any>window).FirebasePlugin.verifyPhoneNumber(phone, 60, async(credential) => {
    //   //   console.log(credential);
    //   //   // ask user to input verificationCode:
    //   //   
    //   // }, (error) => {
    //   //   console.error(error);
    //   // });

    // } else {
    // }
  }

  // Call loginProvider and send a password reset email.
  forgotPassword() {
    this.mixpanelService.track("Forgot-Pasword", {timestamp:Date.now()})
    this.loginProvider.sendPasswordReset(this.emailForm.value["email"]);
    this.clearForms();
  }

  // Clear the forms.
  clearForms() {
    this.emailPasswordForm.reset();
    this.emailForm.reset();
    this.countryCode = "+55";
  }


  back() {
    this.navCtrl.back();
  }

  facebookSignUp(){
    this.mixpanelService.track("Sign-Up", {
      type:"facebook",
      timestamp: Date.now()
    })
  }

  googleSignUp(){
    this.loginProvider.googleLogin();

    this.mixpanelService.track("Sign-Up", {
      type:"google",
      timestamp: Date.now()
    })
  }

  
  showPrivacyModal(){
    this.browserService.browseLink("https://myzura.com/privacy-policy.html")
  }

  showTermsModal(){
    this.browserService.browseLink("https://myzura.com/terms-conditions.html")
   }

  showLegalNotice(){
    this.browserService.browseLink("https://myzura.com/aviso-legal.html")
   }
}
