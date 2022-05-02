import { Injectable } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Validator } from '../../validator';
import { LogoutProvider } from './logout.provider';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateProvider } from './translate.service';

const errorMessages = {
  // Alert Provider
  // This is the provider class for most of the success and error messages in the app.
  // If you added your own messages don't forget to make a function for them or add them in the showErrorMessage switch block.

  // Firebase Error Messages
  accountExistsWithDifferentCredential: { title: 'Account Exists!', subTitle: 'An account with the same credential already exists.' },
  invalidCredential: { title: 'Invalid Credential!', subTitle: 'An error occured logging in with this credential.' },
  operationNotAllowed: { title: 'Login Failed!', subTitle: 'Logging in with this provider is not allowed! Please contact support.' },
  userDisabled: { title: 'Account Disabled!', subTitle: 'Sorry! But this account has been suspended! Please contact support.' },
  userNotFound: { title: 'Account Not Found!', subTitle: 'Sorry, but an account with this credential could not be found.' },
  wrongPassword: { title: 'Incorrect Password!', subTitle: 'Sorry, but the password you have entered is incorrect.' },
  invalidEmail: { title: 'Invalid Email!', subTitle: 'Sorry, but you have entered an invalid email address.' },
  emailAlreadyInUse: { title: 'Email Not Available!', subTitle: 'Sorry, but this email is already in use.' },
  weakPassword: { title: 'Weak Password!', subTitle: 'Sorry, but you have entered a weak password.' },
  requiresRecentLogin: { title: 'Credential Expired!', subTitle: 'Sorry, but this credential has expired! Please login again.' },
  userMismatch: { title: 'User Mismatch!', subTitle: 'Sorry, but this credential is for another user!' },
  providerAlreadyLinked: { title: 'Already Linked!', subTitle: 'Sorry, but your account is already linked to this credential.' },
  credentialAlreadyInUse: { title: 'Credential Not Available!', subTitle: 'Sorry, but this credential is already used by another user.' },
  // Profile Error Messages
  changeName: { title: 'Change Name Failed!', subTitle: 'Sorry, but we\'ve encountered an error changing your name.' },
  invalidCharsName: Validator.profileNameValidator.patternError,
  nameTooShort: Validator.profileNameValidator.lengthError,
  changeEmail: { title: 'Change Email Failed!', subTitle: 'Sorry, but we\'ve encountered an error changing your email address.' },
  invalidProfileEmail: Validator.profileEmailValidator.patternError,
  changePhoto: { title: 'Change Photo Failed!', subTitle: 'Sorry, but we\'ve encountered an error changing your photo.' },
  passwordTooShort: Validator.profilePasswordValidator.lengthError,
  invalidCharsPassword: Validator.profilePasswordValidator.patternError,
  passwordsDoNotMatch: { title: 'Change Password Failed!', subTitle: 'Sorry, but the passwords you entered do not match.' },
  updateProfile: { title: 'Update Profile Failed', subTitle: 'Sorry, but we\'ve encountered an error updating your profile.' },
  usernameExists: { title: 'Username Already Exists!', subTitle: 'Sorry, but this username is already taken by another user.' },
  // Image Error Messages
  imageUpload: { title: 'Image Upload Failed!', subTitle: 'Sorry but we\'ve encountered an error uploading selected image.' },
  // Group Error Messages
  groupUpdate: { title: 'Update Group Failed!', subTitle: 'Sorry, but we\'ve encountered an error updating this group.' },
  groupLeave: { title: 'Leave Group Failed!', subTitle: 'Sorry, but you\'ve encountered an error leaving this group.' },
  groupDelete: { title: 'Delete Group Failed!', subTitle: 'Sorry, but we\'ve encountered an error deleting this group.' }
};

const successMessages = {
  passwordResetSent: { title: 'Password Reset Sent!', subTitle: 'A password reset email has been sent to: ' },
  profileUpdated: { title: 'Profile Updated!', subTitle: 'Your profile has been successfully updated!' },
  emailVerified: { title: 'Email Confirmed!', subTitle: 'Congratulations! Your email has been confirmed!' },
  emailVerificationSent: { title: 'Email Confirmation Sent!', subTitle: 'An email confirmation has been sent to: ' },
  accountDeleted: { title: 'Account Deleted!', subTitle: 'Your account has been successfully deleted.' },
  passwordChanged: { title: 'Password Changed!', subTitle: 'Your password has been successfully changed.' },
  friendRequestSent: { title: 'Friend Request Sent!', subTitle: 'Your friend request has been successfully sent!' },
  friendRequestRemoved: { title: 'Friend Request Deleted!', subTitle: 'Your friend request has been successfully deleted.' },
  groupUpdated: { title: 'Group Updated!', subTitle: 'This group has been successfully updated!' },
  groupLeft: { title: 'Leave Group', subTitle: 'You have successfully left this group.' }
};

@Injectable({ providedIn: 'root' })
export class AlertProvider {
  private alert: any;

  constructor(public alertCtrl: AlertController,
    private translate : TranslateProvider,
    private navCtrl : NavController,
    public logoutProvider: LogoutProvider,
    private toast: ToastController) {
    console.log("Initializing Alert Provider");
  }

  // Show profile updated
  async showProfileUpdatedMessage() {
    this.alert = await this.alertCtrl.create({
      header: successMessages.profileUpdated["title"],
      message: successMessages.profileUpdated["subTitle"],
      buttons: ['OK']
    });
    this.alert.present();
  }

  // Show password reset sent
  async showPasswordResetMessage(email) {
    this.alert = await this.alertCtrl.create({
      header: successMessages.passwordResetSent["title"],
      message: successMessages.passwordResetSent["subTitle"] + email,
      buttons: ['OK']
    })
    this.alert.present();
  }

  // Show email verified and redirect to homePage
  async showEmailVerifiedMessageAndRedirect(router: Router) {
    this.alert = await this.alertCtrl.create({
      header: successMessages.emailVerified["title"],
      message: successMessages.emailVerified["subTitle"],
      buttons: [{
        text: 'OK',
        handler: () => {
          router.navigateByUrl('tabs/reviews', { replaceUrl: true });
        }
      }]
    });
    this.alert.present();
  }

  // Show email verification sent
  async showEmailVerificationSentMessage(email) {
    this.alert = await this.alertCtrl.create({
      header: successMessages.emailVerificationSent["title"],
      message: successMessages.emailVerificationSent["subTitle"] + email,
      buttons: ['OK']
    });
    this.alert.present();
  }

  // Show account deleted
  async showAccountDeletedMessage() {
    this.alert = await this.alertCtrl.create({
      header: successMessages.accountDeleted["title"],
      message: successMessages.accountDeleted["subTitle"],
      buttons: ['OK']
    });
    this.alert.present();
  }

  // Show password changed
  async showPasswordChangedMessage() {
    this.alert = await this.alertCtrl.create({
      header: successMessages.passwordChanged["title"],
      message: successMessages.passwordChanged["subTitle"],
      buttons: ['OK']
    });
    this.alert.present();
  }

  // Show friend request sent
  async showFriendRequestSent() {
    this.alert = await this.alertCtrl.create({
      header: successMessages.friendRequestSent["title"],
      message: successMessages.friendRequestSent["subTitle"],
      buttons: ['OK']
    });
    this.alert.present();
  }

  // Show friend request removed
  async showFriendRequestRemoved() {
    this.alert = await this.alertCtrl.create({
      header: successMessages.friendRequestRemoved["title"],
      message: successMessages.friendRequestRemoved["subTitle"],
      buttons: ['OK']
    });
    this.alert.present();
  }

  // Show group updated.
  async showGroupUpdatedMessage() {
    this.alert = await this.alertCtrl.create({
      header: successMessages.groupUpdated["title"],
      message: successMessages.groupUpdated["subTitle"],
      buttons: ['OK']
    });
    this.alert.present();
  }

  // Show error messages depending on the code
  // If you added custom error codes on top, make sure to add a case block for it.
  async showErrorMessage(code) {
    switch (code) {
      // Firebase Error Messages
      case 'auth/account-exists-with-different-credential':
        this.alert = await this.alertCtrl.create({
          header: errorMessages.accountExistsWithDifferentCredential["title"],
          message: errorMessages.accountExistsWithDifferentCredential["subTitle"],
          buttons: ['OK']
        })
        this.alert.present();
        break;
      case 'auth/invalid-credential':
        this.alert = await this.alertCtrl.create({
          header: errorMessages.invalidCredential["title"],
          message: errorMessages.invalidCredential["subTitle"],
          buttons: ['OK']
        });
        this.alert.present();
        break;
      case 'auth/operation-not-allowed':
        this.alert = await this.alertCtrl.create({
          header: errorMessages.operationNotAllowed["title"],
          message: errorMessages.operationNotAllowed["subTitle"],
          buttons: ['OK']
        });
        this.alert.present();
        break;
      case 'auth/user-disabled':
        this.alert = await this.alertCtrl.create({
          header: errorMessages.userDisabled["title"],
          message: errorMessages.userDisabled["subTitle"],
          buttons: ['OK']
        });
        this.alert.present();
        break;
      case 'auth/user-not-found':
        this.alert = await this.alertCtrl.create({
          header: errorMessages.userNotFound["title"],
          message: errorMessages.userNotFound["subTitle"],
          buttons: ['OK']
        });
        this.alert.present();
        break;
      case 'auth/wrong-password':
        this.alert = await this.alertCtrl.create({
          header: errorMessages.wrongPassword["title"],
          message: errorMessages.wrongPassword["subTitle"],
          buttons: ['OK']
        });
        this.alert.present();
        break;
      case 'auth/invalid-email':
        this.alert = await this.alertCtrl.create({
          header: errorMessages.invalidEmail["title"],
          message: errorMessages.invalidEmail["subTitle"],
          buttons: ['OK']
        });
        this.alert.present();
        break;
      case 'auth/email-already-in-use':
        this.alert = await this.alertCtrl.create({
          header: errorMessages.emailAlreadyInUse["title"],
          message: errorMessages.emailAlreadyInUse["subTitle"],
          buttons: ['OK']
        });
        this.alert.present();
        break;
      case 'auth/weak-password':
        this.alert = await this.alertCtrl.create({
          header: errorMessages.weakPassword["title"],
          message: errorMessages.weakPassword["subTitle"],
          buttons: ['OK']
        });
        this.alert.present();
        break;
      case 'auth/requires-recent-login':
        this.alert = await this.alertCtrl.create({
          header: errorMessages.requiresRecentLogin["title"],
          message: errorMessages.requiresRecentLogin["subTitle"],
          buttons: ['OK']
        });
        this.alert.present();
        break;
      case 'auth/user-mismatch':
        this.alert = await this.alertCtrl.create({
          header: errorMessages.userMismatch["title"],
          message: errorMessages.userMismatch["subTitle"],
          buttons: ['OK']
        });
        this.alert.present();
        break;
      case 'auth/provider-already-linked':
        this.alert = await this.alertCtrl.create({
          header: errorMessages.providerAlreadyLinked["title"],
          message: errorMessages.providerAlreadyLinked["subTitle"],
          buttons: ['OK']
        });
        this.alert.present();
        break;
      case 'auth/credential-already-in-use':
        this.alert = await this.alertCtrl.create({
          header: errorMessages.credentialAlreadyInUse["title"],
          message: errorMessages.credentialAlreadyInUse["subTitle"],
          buttons: ['OK']
        });
        this.alert.present();
        break;
      // Profile Error Messages
      case 'profile/error-change-name':
        this.alert = await this.alertCtrl.create({
          header: errorMessages.changeName["title"],
          message: errorMessages.changeName["subTitle"],
          buttons: ['OK']
        });
        this.alert.present();
        break;
      case 'profile/invalid-chars-name':
        this.alert = await this.alertCtrl.create({
          header: errorMessages.invalidCharsName["title"],
          message: errorMessages.invalidCharsName["subTitle"],
          buttons: ['OK']
        });
        this.alert.present();
        break;
      case 'profile/name-too-short':
        this.alert = await this.alertCtrl.create({
          header: errorMessages.nameTooShort["title"],
          message: errorMessages.nameTooShort["subTitle"],
          buttons: ['OK']
        });
        this.alert.present();
        break;
      case 'profile/error-change-email':
        this.alert = await this.alertCtrl.create({
          header: errorMessages.changeEmail["title"],
          message: errorMessages.changeEmail["subTitle"],
          buttons: ['OK']
        });
        this.alert.present();
        break;
      case 'profile/invalid-email':
        this.alert = await this.alertCtrl.create({
          header: errorMessages.invalidProfileEmail["title"],
          message: errorMessages.invalidProfileEmail["subTitle"],
          buttons: ['OK']
        });
        this.alert.present();
        break;
      case 'profile/error-change-photo':
        this.alert = await this.alertCtrl.create({
          header: errorMessages.changePhoto["title"],
          message: errorMessages.changePhoto["subTitle"],
          buttons: ['OK']
        });
        this.alert.present();
        break;
      case 'profile/password-too-short':
        this.alert = await this.alertCtrl.create({
          header: errorMessages.passwordTooShort["title"],
          message: errorMessages.passwordTooShort["subTitle"],
          buttons: ['OK']
        });
        this.alert.present();
        break;
      case 'profile/invalid-chars-password':
        this.alert = await this.alertCtrl.create({
          header: errorMessages.invalidCharsPassword["title"],
          message: errorMessages.invalidCharsPassword["subTitle"],
          buttons: ['OK']
        });
        this.alert.present();
        break;
      case 'profile/passwords-do-not-match':
        this.alert = await this.alertCtrl.create({
          header: errorMessages.passwordsDoNotMatch["title"],
          message: errorMessages.passwordsDoNotMatch["subTitle"],
          buttons: ['OK']
        });
        this.alert.present();
        break;
      case 'profile/error-update-profile':
        this.alert = await this.alertCtrl.create({
          header: errorMessages.updateProfile["title"],
          message: errorMessages.updateProfile["subTitle"],
          buttons: ['OK']
        });
        this.alert.present();
        break;
      case 'profile/error-same-username':
        this.alert = await this.alertCtrl.create({
          header: errorMessages.usernameExists["title"],
          message: errorMessages.usernameExists["subTitle"],
          buttons: ['OK']
        });
        this.alert.present();
        break;
      //Image Error Messages
      case 'image/error-image-upload':
        this.alert = await this.alertCtrl.create({
          header: errorMessages.imageUpload["title"],
          message: errorMessages.imageUpload["subTitle"],
          buttons: ['OK']
        });
        this.alert.present();
        break;
      // Group Error MEssages
      case 'group/error-update-group':
        this.alert = await this.alertCtrl.create({
          header: errorMessages.groupUpdate["title"],
          message: errorMessages.groupUpdate["subTitle"],
          buttons: ['OK']
        });
        this.alert.present();
        break;
      case 'group/error-leave-group':
        this.alert = await this.alertCtrl.create({
          header: errorMessages.groupLeave["title"],
          message: errorMessages.groupLeave["subTitle"],
          buttons: ['OK']
        });
        this.alert.present();
        break;
      case 'group/error-delete-group':
        this.alert = await this.alertCtrl.create({
          header: errorMessages.groupDelete["title"],
          message: errorMessages.groupDelete["subTitle"],
          buttons: ['OK']
        });
        this.alert.present();
        break;
    }
  }
  async showToast(msg) {
    let toast = await this.toast.create({
      message: msg,
      duration: 5000,
      position: "middle",
      color:"#33474C"
    });
    toast.present();
  }


  async addReviewPopup(){
  
    const alert = await this.alertCtrl.create({
      header: this.translate.get("alert.addreview.title"),
      message: this.translate.get("alert.addreview.description"),
      buttons: [
        {
          text: this.translate.get("alert.addreview.later"),
          handler: data => {
            this.navCtrl.navigateForward('tabs/reviews');
          }
        },
        {
          text: this.translate.get("alert.addreview.yes"),
          handler: data => {
            this.navCtrl.navigateForward('tabs/crop-photo');
          }
        }
      ]
    });
    alert.present();
}

}
