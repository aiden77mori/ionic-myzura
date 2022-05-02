import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginProvider } from '../../services/login.provider';
import { TranslateProvider } from 'src/app/services/translate.service';
import { AngularFireAuth } from '@angular/fire/auth';
 import { BrowserService } from 'src/app/services/browser.service';

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
  styleUrls: ['signin.scss']
})
export class SignInPage implements OnInit {


  loginForm: FormGroup;

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email or Username is required.' }
 //   ,  { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 6 characters long.' }
    ]
  };

  // LoginPage
  // This is the page where the user can register and login to our app.
  // It's important to initialize the loginProvider here and setNavController as it will direct the routes of our app.
  constructor(
    private router: Router,
    public loginProvider: LoginProvider,
    public formBuilder: FormBuilder,
    private afAuth: AngularFireAuth,
    private browserService: BrowserService,
    private navCtrl: NavController,
    public translate: TranslateProvider) {


    // It's important to hook the navController to our loginProvider.
    this.loginProvider.setNavController(this.router);
    // Create our forms and their validators based on validators set on validator.ts.

    this.loginForm = new FormGroup({
      'email': new FormControl('', Validators.compose([
        Validators.required//,
     //   Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      'password': new FormControl('', Validators.compose([
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
  }



  //constructor --> ionViewDidLoad --> ionViewWillEnter --> ionViewDidEnter --> ionViewWillLeave --> ionViewDidLeave --> ionViewWillUnload.

  ionViewDidEnter (){
    this.afAuth.user.subscribe(user => {
      if (user) {
        // this.dataProvider.setLoggedInUser(user)
        this.navCtrl.navigateForward('/tabs/reviews');
      } else {
      //   this.toast.showToast('User is not logged in');
      // console.log("AUTHGUARD")
      //   this.router.navigateByUrl('/auth/landing');
      //   // resolve(false);
      }
    });
  }

  // Call loginProvider and login the user with email and password.
  // You may be wondering where the login function for Facebook and Google are.
  // They are called directly from the html markup via loginProvider.facebookLogin() and loginProvider.googleLogin().
  login() {

    this.loginProvider.emailLogin(this.loginForm.value["email"], this.loginForm.value["password"]);

  }


  back() {
    this.navCtrl.back();
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
