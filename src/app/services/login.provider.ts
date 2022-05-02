// import { Facebook } from 'ng2-cordova-oauth/core';
// import { OauthCordova } from 'ng2-cordova-oauth/platform/cordova';
import firebase from 'firebase';
// import { Login } from '../login';
// import { LoadingProvider } from './loading';
// import { AlertProvider } from './alert';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { ImageProvider } from './image.provider';
import { Router } from '@angular/router';


import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { LoadingProvider } from './loading.provider';
import { AlertProvider } from './alert.provider';
import { environment } from 'src/environments/environment';
import { NavController } from '@ionic/angular';
import { NotificationsService } from './notifications.service';
import { UserBody } from '../models/userBody';
@Injectable({ providedIn: 'root' })
export class LoginProvider {
  // Login Provider
  // This is the provider class for most of the login functionalities on Firebase.
  // It's important that you set your Firebase and Social settings on login.ts
  // Other customizations can be done on login.ts such as setting your own the homePage,
  // trialPage, and verificationPages or disabling emailVerification.
  // It's important to hook this provider up with your navCtrl
  // In the constructor of the controller that uses this provider, call setNavController(navCtrl).
  // private oauth: OauthCordova;
  private router: Router;
  // private facebookProvider = new Facebook({
  //   clientId: Login.facebookAppId,
  //   appScope: ["email"]
  // });

  constructor(
    public loadingProvider: LoadingProvider,
    public navCtrl: NavController,
    public alertProvider: AlertProvider,
    public googlePlus: GooglePlus,
    private imageProvider: ImageProvider,
    private notification: NotificationsService,

    private afAuth: AngularFireAuth
  ) {
    console.log("Initializing Login Provider");
    // this.oauth = new OauthCordova();
    // Detect changes on the Firebase user and redirects the view depending on the user's status.

    // this.afAuth.authState.subscribe(user => {
    //   if (user) {
    //     if (user["isAnonymous"]) {
    //       //Goto Trial Page.
    //     } else {
    //       if (environment.emailVerification) {
    //         // If user is vefified log in
    //         if (user["emailVerified"]) {
    //           //Goto Home Page.
    //           this.router.navigateByUrl('tabs/reviews', { replaceUrl: true });
    //           //Since we're using a TabsPage an NgZone is required.
    //         } else {
    //           //Goto Verification Page.
    //           this.router.navigateByUrl('verification');
    //         }
    //       } else {
    //         //Goto Home Page.
    //         this.router.navigateByUrl('tabs/reviews', { replaceUrl: true });
    //         //Since we're using a TabsPage an NgZone is required.
    //       }
    //     }
    //   }

    // });
  }

  // Hook this provider up with the navigationController.
  // This is important, so the provider can redirect the app to the views depending
  // on the status of the Firebase user.
  setNavController(router) {
    this.router = router;
  }

  // Facebook Login, after successful authentication, triggers firebase.auth().onAuthStateChanged((user) on top and
  // redirects the user to its respective views. Make sure to set your FacebookAppId on login.ts
  // and enabled Facebook Login on Firebase app authentication console.
  // facebookLogin() {
  //   this.oauth.logInVia(this.facebookProvider).then(success => {
  //     let credential = firebase.auth.FacebookAuthProvider.credential(success['access_token']);
  //     this.loadingProvider.show();
  //     firebase.auth().signInWithCredential(credential)
  //       .then((success) => {
  //         this.loadingProvider.hide();
  //       })
  //       .catch((error) => {
  //         this.loadingProvider.hide();
  //         let code = error["code"];
  //         this.alertProvider.showErrorMessage(code);
  //       });
  //   }, error => { });
  // }

  // Google Login, after successful authentication, triggers firebase.auth().onAuthStateChanged((user) on top and
  // redirects the user to its respective views. Make sure to set your GoogleWebClient Id on login.ts
  // and enabled Google Login on Firebase app authentication console.
  googleLogin() {
    this.loadingProvider.show();
    this.googlePlus.login({
      'webClientId': environment.googleClientId
    }).then((success) => {
      console.log("===login with googlePlus==", success)
      let credential = firebase.auth.GoogleAuthProvider.credential(success['idToken'], null);
      firebase.auth().signInWithCredential(credential)
        .then((success) => {
          console.log("=====success", success)
          this.loadingProvider.hide();
        })
        .catch((error) => {
          this.loadingProvider.hide();
          console.log("=====error", error)
          let code = error["code"];
          this.alertProvider.showErrorMessage(code);
        });
    }, error => { this.loadingProvider.hide(); });
  }

  // Anonymous Login, after successful authentication, triggers firebase.auth().onAuthStateChanged((user) on top and
  // redirects the user to its respective views. Make sure to enable Anonymous login on Firebase app authentication console.
  guestLogin() {
    this.loadingProvider.show();
    firebase.auth().signInAnonymously()
      .then((success) => {
        this.loadingProvider.hide();
      })
      .catch((error) => {
        this.loadingProvider.hide();
        let code = error["code"];
        this.alertProvider.showErrorMessage(code);
      });
  }

  // Login on Firebase given the email and password.
  emailLogin(email, password) {
    this.loadingProvider.show();
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((success) => {
        console.log(success)
        this.notification.setToken(success.user.uid)


        this.loadingProvider.hide();
        this.navCtrl.navigateForward('tabs/reviews')

      })
      .catch((error) => {
        this.loadingProvider.hide();
        let code = error["code"];
        this.alertProvider.showErrorMessage(code);
      });
  }

  // Register user on Firebase given the email and password.
  signup(email, password) {
    this.loadingProvider.show();
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((success) => {
        console.log(success)
        let userId =success.user.uid;
        firebase.database().ref('accounts/' + userId).set({
          userId: userId,
          email: email,
          provider: 'firebase',
          registerDate: Date.now(),
          followers: "",
          following: "",
          description:'',
          verified:false,
          business:false,
          profilePic: ''

        }).then((user) => {
          let navigationExtras = {
            queryParams: {
              userId:  userId,
            }
          };
          this.navCtrl.navigateForward('auth/register', navigationExtras)
        });
        this.loadingProvider.hide();
      })
      .catch((error) => {
        this.loadingProvider.hide();
        let code = error["code"];
        this.alertProvider.showErrorMessage(code);
      });
  }

  addProfile(userId, name, username,birthDate, gender) {
    firebase.database().ref('accounts/' + userId).update({
          // userId: userId,
          name: name,
          username: username,
          birthDate: birthDate,
          userBody: {gender: gender},
          addedBodySizes: false,
          iseVerified: false,
          addedShoesSizes: false
        }).then((user) => {
          return true
        })
      .catch((error) => {
        this.loadingProvider.hide();
        let code = error["code"];
        this.alertProvider.showErrorMessage(code);
        return false

      });
  }

  addBody(userId, params, firstTime) {
    console.log(userId, params)
    firebase.database().ref('accounts/' + userId+'/userBody').set(params).then((user) => {


          return true
        })
      .catch((error) => {
        this.loadingProvider.hide();
        let code = error["code"];
        this.alertProvider.showErrorMessage(code);
        return false

      });
  }

  // addBodyMeasures(userId, height, weight,gender) {
  //   firebase.database().ref('accounts/' + userId+'/userBody').update({
  //         // userId: userId,
  //         height: height,
  //         weight: weight,
  //         gender: gender

  //       }).then((user) => {
  //         return true
  //       })
  //     .catch((error) => {
  //       this.loadingProvider.hide();
  //       let code = error["code"];
  //       this.alertProvider.showErrorMessage(code);
  //       return false

  //     });
  // }
  register(email, password, obj) {
    this.loadingProvider.show();
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((success) => {
        let user = firebase.auth().currentUser;
        firebase.database().ref('accounts/' + user.uid).set({
          // ...bodyData,
          userId: user.uid,
          // phone: obj.phone,
          name: obj.name,
          username: obj.username,
          profilePic: obj.image,
        }).then((user) => {
          this.imageProvider.uploadProfilePhoto(obj, obj.image);

        });
        this.loadingProvider.hide();
      })
      .catch((error) => {
        this.loadingProvider.hide();
        let code = error["code"];
        this.alertProvider.showErrorMessage(code);
      });
  }

  registerByPhone = (userData, verification, confirmationCode) => {
    let signInCredential: any = firebase.auth.PhoneAuthProvider.credential(verification, confirmationCode);
    firebase.auth().signInWithCredential(signInCredential).then((data) => {
      let user = firebase.auth().currentUser;
      firebase.database().ref('accounts/' + user.uid).set({
        userId: user.uid,
        phone: userData.phone,
        name: userData.name,
        username: userData.username
      }).then((user) => {
        this.imageProvider.uploadProfilePhoto(userData, userData.image);

      });
    });
  }

  // Send Password Reset Email to the user.
  sendPasswordReset(email) {
    this.loadingProvider.show();
    firebase.auth().sendPasswordResetEmail(email)
      .then((success) => {
        this.loadingProvider.hide();
        this.alertProvider.showPasswordResetMessage(email);
      })
      .catch((error) => {
        this.loadingProvider.hide();
        let code = error["code"];
        this.alertProvider.showErrorMessage(code);
      });
  }

}
