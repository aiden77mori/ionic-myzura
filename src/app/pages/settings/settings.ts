import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';

import firebase from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { LogoutProvider } from 'src/app/services/logout.provider';
import { LoadingProvider } from 'src/app/services/loading.provider';
import { ImageProvider } from 'src/app/services/image.provider';
import { AngularFireDatabase } from '@angular/fire/database';
import { AlertProvider } from 'src/app/services/alert.provider';
import { DataProvider } from 'src/app/services/data.provider';
import { Validator } from 'src/validator';
import { environment } from 'src/environments/environment';
import { TranslateProvider } from 'src/app/services/translate.service';
 import { BrowserService } from 'src/app/services/browser.service';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  styleUrls: ['settings.scss']
})
export class SettingsPage {
  public user: any;
  private alert: any;
  private profilePhotoOptions: CameraOptions;

  constructor(
    public alertCtrl: AlertController,
    public translate: TranslateProvider,
    public logoutProvider: LogoutProvider,
    public loadingProvider: LoadingProvider,
    public imageProvider: ImageProvider,
    public angularDb: AngularFireDatabase,
    public alertProvider: AlertProvider,
    public dataProvider: DataProvider,
    private browserService: BrowserService,

    public camera: Camera,
    private router: Router,
    private navCtrl : NavController) {
      this.profilePhotoOptions = {
        quality: 50,
        targetWidth: 384,
        targetHeight: 384,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        correctOrientation: true
      };
    this.logoutProvider.setRouter(this.router);
  }


  ionViewDidEnter() {
    // Observe the userData on database to be used by our markup html.
    // Whenever the userData on the database is updated, it will automatically reflect on our user variable.
    this.dataProvider.getCurrentUser().subscribe((user) => {
      this.user = <any>user;
    });
  }

  // Change user's profile photo. Uses imageProvider to process image and upload on Firebase and update userData.
  async setPhoto() {
    // Ask if the user wants to take a photo or choose from photo gallery.
    this.alert = await this.alertCtrl.create({
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
            // Call imageProvider to process, upload, and update user photo.
            // this.imageProvider.setProfilePhoto(this.user, this.camera.PictureSourceType.PHOTOLIBRARY);
            this.getProfilePic(this.camera.PictureSourceType.PHOTOLIBRARY, this.user)

          }
        },
        {
          text: 'Take Photo',
          handler: () => {
            // Call imageProvider to process, upload, and update user photo.
            // this.imageProvider.setProfilePhoto(this.user, this.camera.PictureSourceType.CAMERA);
            this.getProfilePic(this.camera.PictureSourceType.CAMERA, this.user)

          }
        }
      ]
    });
    this.alert.present();
  }

  getProfilePic(sourceType, user){
    this.profilePhotoOptions.sourceType = sourceType;
    this.camera.getPicture(this.profilePhotoOptions).then((imageData) => {
      imageData = "data:image/jpeg;base64," + imageData
      this.navCtrl.navigateForward('tabs/profile/settings/crop-profile', { state: { src: imageData, user: user} });
    });
  }
  // Change user's profile name, username, and description.
  async setName() {
    this.alert = await this.alertCtrl.create({
      header: 'Change Profile Name',
      message: "Please enter a new profile name.",
      inputs: [
        {
          name: 'name',
          placeholder: 'Your Name',
          value: this.capitalize_Words(this.user.name)
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Save',
          handler: data => {
            let name = data["name"];
            // Check if entered name is different from the current name
            if (this.user.name != name) {
              // Check if name's length is more than five characters
              if (name.length >= Validator.profileNameValidator.minLength) {
                // Check if name contains characters and numbers only.
                if (Validator.profileNameValidator.pattern.test(name)) {
                  this.loadingProvider.show();
                  let profile = {
                    displayName: name,
                    photoURL: this.user.photoURL
                  };
                  // Update profile on Firebase
                  firebase.auth().currentUser.updateProfile(profile)
                    .then((success) => {
                      // Update userData on Database.
                      this.angularDb.object('/accounts/' + this.user.userId).update({
                        name: name
                      }).then((success) => {
                        Validator.profileNameValidator.pattern.test(name); //Refresh validator
                        this.alertProvider.showProfileUpdatedMessage();
                      }).catch((error) => {
                        this.alertProvider.showErrorMessage('profile/error-update-profile');
                      });
                    })
                    .catch((error) => {
                      // Show error
                      this.loadingProvider.hide();
                      let code = error["code"];
                      this.alertProvider.showErrorMessage(code);
                      if (code == 'auth/requires-recent-login') {
                        this.logoutProvider.logout().then(res => {
                          this.router.navigateByUrl('/', { replaceUrl: true });
                        });
                      }
                    });
                } else {
                  this.alertProvider.showErrorMessage('profile/invalid-chars-name');
                }
              } else {
                this.alertProvider.showErrorMessage('profile/name-too-short');
              }
            }
          }
        }
      ]
    });
    this.alert.present();
  }


  capitalize_Words(str)
  {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }
  //Set username
  async setUsername() {
    this.alert = await this.alertCtrl.create({
      header: 'Change Username',
      message: "Please enter a new username.",
      inputs: [
        {
          name: 'username',
          placeholder: 'Your Username',
          value: this.user.username.toLowerCase()
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Save',
          handler: data => {
            let username = data["username"];
            // Check if entered username is different from the current username
            if (this.user.username != username) {
              this.dataProvider.getUserWithUsername(username).valueChanges().pipe(take(1)).subscribe((userList) => {
                if (userList.length > 0) {
                  this.alertProvider.showErrorMessage('profile/error-same-username');
                } else {
                  this.angularDb.object('/accounts/' + this.user.userId).update({
                    username: username
                  }).then((success) => {
                    this.alertProvider.showProfileUpdatedMessage();
                  }).catch((error) => {
                    this.alertProvider.showErrorMessage('profile/error-update-profile');
                  });
                }
              });
            }
          }
        }
      ]
    });
    this.alert.present();
  }


    //setBody
    setBodyMeasures(){
      console.log(this.user.userId)
      this.navCtrl.navigateForward('tabs/profile/settings/edit/'+this.user.userId)

    }
    setShoesMeasures(){

      console.log(this.user.userId)
      let navigationExtras = {
        queryParams: {
          userId:  this.user.userId,
        }
      };
      this.navCtrl.navigateForward('tabs/profile/settings/shoes/',navigationExtras)


    }
  //Set description.
  async setDescription() {
    this.alert = await this.alertCtrl.create({
      header: 'Change Description',
      message: "Please enter a new description.",
      inputs: [
        {
          name: 'description',
          placeholder: 'Your Description',
          value: this.user.description
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Save',
          handler: data => {
            let description = data["description"];
            // Check if entered description is different from the current description
            if (this.user.description != description) {
              this.angularDb.object('/accounts/' + this.user.userId).update({
                description: description
              }).then((success) => {
                this.alertProvider.showProfileUpdatedMessage();
              }).catch((error) => {
                this.alertProvider.showErrorMessage('profile/error-update-profile');
              });
            }
          }
        }
      ]
    });
    this.alert.present();
  }

  // Change user's email. Uses Validator.ts to validate the entered email. After, update the userData on database.
  // When the user changed their email, they have to confirm the new email address.
  async setEmail() {
    this.alert = await this.alertCtrl.create({
      header: 'Change Email Address',
      message: "Please enter a new email address.",
      inputs: [
        {
          name: 'email',
          placeholder: 'Your Email Address',
          value: this.user.email
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Save',
          handler: data => {
            let email = data["email"];
            //Check if entered email is different from the current email
            if (this.user.email != email) {
              //Check if email is valid.
              if (Validator.profileEmailValidator.pattern.test(email)) {
                this.loadingProvider.show();
                // Update email on Firebase.
                firebase.auth().currentUser.updateEmail(email)
                  .then((success) => {
                    // Update userData on Database.
                    this.angularDb.object('/accounts/' + this.user.userId).update({
                      email: email
                    }).then((success) => {
                      Validator.profileEmailValidator.pattern.test(email);
                      // Check if emailVerification is enabled, if it is go to verificationPage.
                      if (environment.emailVerification) {
                        if (!firebase.auth().currentUser.emailVerified) {
                          this.router.navigateByUrl('verification', { replaceUrl: true });
                        }
                      }
                    }).catch((error) => {
                      this.alertProvider.showErrorMessage('profile/error-change-email');
                    });
                  })
                  .catch((error) => {
                    //Show error
                    this.loadingProvider.hide();
                    let code = error["code"];
                    this.alertProvider.showErrorMessage(code);
                    if (code == 'auth/requires-recent-login') {
                      this.logoutProvider.logout().then(res => {
                        this.router.navigateByUrl('/', { replaceUrl: true });
                      });
                    }
                  });
              } else {
                this.alertProvider.showErrorMessage('profile/invalid-email');
              }
            }
          }
        }
      ]
    });
    this.alert.present();
  }

  // Change user's password, this option only shows up for users registered via Firebase.
  // The currentPassword is first checked, after which the new password should be entered twice.
  // Uses password validator from Validator.ts.
  async setPassword() {
    this.alert = await this.alertCtrl.create({
      header: 'Change Password',
      message: "Please enter a new password.",
      inputs: [
        {
          name: 'currentPassword',
          placeholder: 'Current Password',
          type: 'password'
        },
        {
          name: 'password',
          placeholder: 'New Password',
          type: 'password'
        },
        {
          name: 'confirmPassword',
          placeholder: 'Confirm Password',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Save',
          handler: data => {
            let currentPassword = data["currentPassword"];
            let credential = firebase.auth.EmailAuthProvider.credential(this.user.email, currentPassword);
            // Check if currentPassword entered is correct
            this.loadingProvider.show();
            firebase.auth().currentUser.reauthenticateWithCredential(credential)
              .then((success) => {
                let password = data["password"];
                // Check if entered password is not the same as the currentPassword
                if (password != currentPassword) {
                  if (password.length >= Validator.profilePasswordValidator.minLength) {
                    if (Validator.profilePasswordValidator.pattern.test(password)) {
                      if (password == data["confirmPassword"]) {
                        // Update password on Firebase.
                        firebase.auth().currentUser.updatePassword(password)
                          .then((success) => {
                            this.loadingProvider.hide();
                            Validator.profilePasswordValidator.pattern.test(password);
                            this.alertProvider.showPasswordChangedMessage();
                          })
                          .catch((error) => {
                            this.loadingProvider.hide();
                            let code = error["code"];
                            this.alertProvider.showErrorMessage(code);
                            if (code == 'auth/requires-recent-login') {
                              this.logoutProvider.logout().then(res => {
                                this.router.navigateByUrl('/', { replaceUrl: true });
                              });
                            }
                          });
                      } else {
                        this.alertProvider.showErrorMessage('profile/passwords-do-not-match');
                      }
                    } else {
                      this.alertProvider.showErrorMessage('profile/invalid-chars-password');
                    }
                  } else {
                    this.alertProvider.showErrorMessage('profile/password-too-short');
                  }
                }
              })
              .catch((error) => {
                //Show error
                this.loadingProvider.hide();
                let code = error["code"];
                this.alertProvider.showErrorMessage(code);
              });
          }
        }
      ]
    });
    this.alert.present();
  }

  // Delete the user account. After deleting the Firebase user, the userData along with their profile pic uploaded on the storage will be deleted as well.
  // If you added some other info or traces for the account, make sure to account for them when deleting the account.
  async deleteAccount() {
    this.alert = await this.alertCtrl.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete your account? This cannot be undone.',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Delete',
          handler: data => {
            this.loadingProvider.show();
            // Delete Firebase user
            firebase.auth().currentUser.delete()
              .then((success) => {
                // Delete profilePic of user on Firebase storage
                this.imageProvider.deleteUserImageFile(this.user);
                // Delete user data on Database
                this.angularDb.object('/accounts/' + this.user.userId).remove().then(() => {
                  this.loadingProvider.hide();
                  this.alertProvider.showAccountDeletedMessage();
                  this.logoutProvider.logout().then(res => {
                    this.router.navigateByUrl('/', { replaceUrl: true });
                  });
                });
              })
              .catch((error) => {
                this.loadingProvider.hide();
                let code = error["code"];
                this.alertProvider.showErrorMessage(code);
                if (code == 'auth/requires-recent-login') {
                  this.logoutProvider.logout().then(res => {
                    this.router.navigateByUrl('/', { replaceUrl: true });
                  });
                }
              });
          }
        }
      ]
    });
    this.alert.present();
  }

  // Log the user out.
  async logout() {
    this.alert = await this.alertCtrl.create({
      header: 'Confirm Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Logout',
          handler: data => {
            this.logoutProvider.logout().then(res => {
              this.router.navigateByUrl('/', { replaceUrl: true });
            });

          }
        }
      ]
    });
    this.alert.present();

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

   gotoProfit() {
    this.navCtrl.navigateForward('tabs/profile/settings/profit');
  }

  gotoPersonalInfo() {
    this.navCtrl.navigateForward('tabs/profile/settings/personal');
  }

  gotoSizeInfo() {
    this.navCtrl.navigateForward('tabs/profile/settings/size');
  }

  gotoSecurity() {
    this.navCtrl.navigateForward('tabs/profile/settings/security');
  }

  gotoLegalInfo() {
    this.navCtrl.navigateForward('tabs/profile/settings/legal');
  }

  back(){
    this.navCtrl.back();
  }
}
