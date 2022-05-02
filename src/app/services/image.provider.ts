import { Injectable } from '@angular/core';
import { AlertProvider } from './alert.provider';
import { LoadingProvider } from './loading.provider';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import firebase from 'firebase';
import { AngularFireDatabase } from '@angular/fire/database';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertController } from '@ionic/angular';
// import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Capacitor } from '@capacitor/core';
import { MyZuraApiService } from './myzura.api.service';

@Injectable({ providedIn: 'root' })
export class ImageProvider {
  // Image Provider
  // This is the provider class for most of the image processing including uploading images to Firebase.
  // Take note that the default function here uploads the file in .jpg. If you plan to use other encoding types, make sure to
  // set the encodingType before uploading the image on Firebase.
  // Example for .png:
  // data:image/jpeg;base64 -> data:image/png;base64
  // generateFilename to return .png
  private profilePhotoOptions: CameraOptions;
  private photoMessageOptions: CameraOptions;
  private groupPhotoOptions: CameraOptions;
  // All files to be uploaded on Firebase must have DATA_URL as the destination type.
  // This will return the imageURI which can then be processed and uploaded to Firebase.
  // For the list of cameraOptions, please refer to: https://github.com/apache/cordova-plugin-camera#module_camera.CameraOptions
  public alert: any;
  constructor(public angularDb: AngularFireDatabase,
    // private webView: WebView,
    public alertProvider: AlertProvider,
    public loadingProvider: LoadingProvider,
    public camera: Camera,
    private myzuraAPI: MyZuraApiService,
    public alertCtrl: AlertController,
    private sanitizer: DomSanitizer) {
    console.log("Initializing Image Provider");
    this.profilePhotoOptions = {
      quality: 50,
      targetWidth: 384,
      targetHeight: 384,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    };

    this.photoMessageOptions = {
      quality: 50,
      // targetWidth: 300,
      // targetHeight: 200,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true,
      allowEdit: true,
    };

    this.groupPhotoOptions = {
      quality: 50,
      targetWidth: 384,
      targetHeight: 384,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    };
  }

  // Function to convert dataURI to Blob needed by Firebase
  imgURItoBlob(dataURI) {
    try {
      var binary = atob(dataURI.split(',')[1]);
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      var array = [];
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], {
        type: mimeString
      });
    } catch (error) {
      return;
    }
  }

  // Generate a random filename of length for the image to be uploaded
  generateFilename() {
    var length =28;
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text + ".jpg";
  }

  generateFilenameNoExt() {
    var length =28;
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
  generateFilenameProduct() {
    var length =28;
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text + ".png";
  }
  // Set ProfilePhoto given the user and the cameraSourceType.
  // This function processes the imageURI returned and uploads the file on Firebase,
  // Finally the user data on the database is updated.
  setProfilePhoto(user, imageData) {
    this.loadingProvider.show();

      let imgBlob = this.imgURItoBlob(imageData);
      let metadata = {
        'contentType': imgBlob.type
      };
      // Generate filename and upload to Firebase Storage.
      let fileName = this.generateFilename()
      firebase.storage().ref().child('images/profilePhotos/' + user.userId + '/' + fileName).put(imgBlob, metadata).then(async (snapshot) => {
        // Delete previous profile photo on Storage if it exists.
        console.log('Snapshot', snapshot);
        const { metadata } = snapshot;
        let url: any = await firebase.storage().ref(metadata.fullPath).getDownloadURL();

        console.log('URL', url);
        let currentUser = firebase.auth().currentUser.uid;
        console.log('uid', currentUser);

        this.myzuraAPI.addPhotosToProfile({
          "userId" : currentUser,
          "fullResURL" : url,
          "fileName" : fileName
        })

        this.angularDb.object('/accounts/' + currentUser).update({
          profilePic: url
        }).then((success) => {
          console.log('Success', success);
          this.loadingProvider.hide();
          this.alertProvider.showProfileUpdatedMessage();
        }).catch((error) => {
          console.log('Error', error);
          this.loadingProvider.hide();
          this.alertProvider.showErrorMessage('profile/error-change-photo');
        });
        let profile = {
          displayName: user.name,
          photoURL: url
        };
        // Update Firebase User.
        firebase.auth().currentUser.updateProfile(profile)
          .then((success) => {
            // Update User Data on Database.
            console.log('Success.curr', success);
          })
          .catch((error) => {
            this.loadingProvider.hide();
            console.log('Error.curr', error);
            this.alertProvider.showErrorMessage('profile/error-change-photo');
          });
      }).catch((error) => {
        this.loadingProvider.hide();
        console.log('Error.up', error);
        this.alertProvider.showErrorMessage('image/error-image-upload');
      }).catch((error) => {
        console.log('Error.up', error);
        this.loadingProvider.hide();
      });

  }

  uploadProfilePhoto(user, imageData) {
    console.log('Uploading new user\'s photo', imageData);
    let imgBlob = this.imgURItoBlob(imageData);
    if (!imgBlob) return;
    let metadata = {
      'contentType': imgBlob.type
    };
    const userId = firebase.auth().currentUser.uid;

    firebase.storage().ref().child('images/' + userId + '/profilePhotos/' + this.generateFilename()).put(imgBlob, metadata).then(async (snapshot) => {
      // Delete previous profile photo on Storage if it exists.
      console.log('Snapshot', snapshot);
      //this.deleteImageFile(user.profilePic);
      // URL of the uploaded image!
      const { metadata } = snapshot;
      let url: any = await firebase.storage().ref(metadata.fullPath).getDownloadURL();
      console.log('URL', url);
      let currentUser = firebase.auth().currentUser.uid;
      console.log('uid', currentUser);


      this.angularDb.object('/accounts/' + currentUser).update({
        profilePic: url
      }).then((success) => {
        console.log('Success', success);
        this.loadingProvider.hide();
        // this.alertProvider.showProfileUpdatedMessage();
      }).catch((error) => {
        console.log('Error', error);
        this.loadingProvider.hide();
        this.alertProvider.showErrorMessage('profile/error-change-photo');
      });
      let profile = {
        displayName: user.name,
        photoURL: url
      };
      // Update Firebase User.
      firebase.auth().currentUser.updateProfile(profile)
        .then((success) => {
          // Update User Data on Database.
          console.log('Success.curr', success);
        })
        .catch((error) => {
          this.loadingProvider.hide();
          console.log('Error.curr', error);
          this.alertProvider.showErrorMessage('profile/error-change-photo');
        });
    }).catch((error) => {
      this.loadingProvider.hide();
      console.log('Error.up', error);
      this.alertProvider.showErrorMessage('image/error-image-upload');
    });
  }


  // Upload and set the group object's image.
  setGroupPhoto(group, sourceType) {
    this.groupPhotoOptions.sourceType = sourceType;
    this.loadingProvider.show();
    // Get picture from camera or gallery.
    this.camera.getPicture(this.groupPhotoOptions).then((imageData) => {
      // Process the returned imageURI.
      let imgBlob = this.imgURItoBlob("data:image/jpeg;base64," + imageData);
      let metadata = {
        'contentType': imgBlob.type
      };
      firebase.storage().ref().child('images/' + firebase.auth().currentUser.uid + '/' + this.generateFilename()).put(imgBlob, metadata).then(async (snapshot) => {
        this.deleteImageFile(group.profilePic);
        // URL of the uploaded image!
        const { metadata } = snapshot;
        let url: any = await firebase.storage().ref(metadata.fullPath).getDownloadURL();
        group.profilePic = url;
        this.loadingProvider.hide();
      }).catch((error) => {
        this.loadingProvider.hide();
        this.alertProvider.showErrorMessage('image/error-image-upload');
      });
    }).catch((error) => {
      this.loadingProvider.hide();
    });
  }

  // Set group photo and return the group object as promise.
  setGroupPhotoPromise(group, sourceType): Promise<any> {
    return new Promise(resolve => {
      this.groupPhotoOptions.sourceType = sourceType;
      this.loadingProvider.show();
      // Get picture from camera or gallery.
      this.camera.getPicture(this.groupPhotoOptions).then((imageData) => {
        // Process the returned imageURI.
        let imgBlob = this.imgURItoBlob("data:image/jpeg;base64," + imageData);
        let metadata = {
          'contentType': imgBlob.type
        };
        firebase.storage().ref().child('images/' + firebase.auth().currentUser.uid + '/' + this.generateFilename()).put(imgBlob, metadata).then(async (snapshot) => {
          this.deleteImageFile(group.profilePic);
          // URL of the uploaded image!
          const { metadata } = snapshot;
          let url: any = await firebase.storage().ref(metadata.fullPath).getDownloadURL();
          group.profilePic = url;
          this.loadingProvider.hide();
          resolve(group);
        }).catch((error) => {
          this.loadingProvider.hide();
          this.alertProvider.showErrorMessage('image/error-image-upload');
        });
      }).catch((error) => {
        this.loadingProvider.hide();
      });
    });
  }

  //Delete the image given the url.
  deleteImageFile(path) {
    var fileName = path.substring(path.lastIndexOf('%2F') + 3, path.lastIndexOf('?'));
    firebase.storage().ref().child('images/' + firebase.auth().currentUser.uid + '/' + fileName).delete().then(() => { }).catch((error) => { });
  }

  //Delete the user.profilePic given the user.
  deleteUserImageFile(user) {
    var fileName = user.profilePic.substring(user.profilePic.lastIndexOf('%2F') + 3, user.profilePic.lastIndexOf('?'));
    firebase.storage().ref().child('images/' + user.userId + '/' + fileName).delete().then(() => { }).catch((error) => { });
  }

  // Delete group image file on group storage reference.
  deleteGroupImageFile(groupId, path) {
    var fileName = path.substring(path.lastIndexOf('%2F') + 3, path.lastIndexOf('?'));
    firebase.storage().ref().child('images/' + groupId + '/' + fileName).delete().then(() => { }).catch((error) => { });
  }

  // Upload photo message and return the url as promise.
  uploadPhotoMessage(conversationId, sourceType): Promise<any> {
    return new Promise(resolve => {
      this.photoMessageOptions.sourceType = sourceType;
      this.loadingProvider.show();
      // Get picture from camera or gallery.
      this.camera.getPicture(this.photoMessageOptions).then((imageData) => {
        // Process the returned imageURI.
        let imgBlob = this.imgURItoBlob("data:image/jpeg;base64," + imageData);
        let metadata = {
          'contentType': imgBlob.type
        };
        // Generate filename and upload to Firebase Storage.
        firebase.storage().ref().child('images/' + conversationId + '/' + this.generateFilename()).put(imgBlob, metadata).then(async (snapshot) => {
          // URL of the uploaded image!
          const { metadata } = snapshot;
          let url: any = await firebase.storage().ref(metadata.fullPath).getDownloadURL();
          this.loadingProvider.hide();
          resolve(url);
        }).catch((error) => {
          this.loadingProvider.hide();
          this.alertProvider.showErrorMessage('image/error-image-upload');
        });
      }).catch((error) => {
        this.loadingProvider.hide();
      });
    });
  }

  // Upload group photo message and return a promise as url.
  uploadGroupPhotoMessage(groupId, sourceType): Promise<any> {
    return new Promise(resolve => {
      this.photoMessageOptions.sourceType = sourceType;
      this.loadingProvider.show();
      // Get picture from camera or gallery.
      this.camera.getPicture(this.photoMessageOptions).then((imageData) => {
        // Process the returned imageURI.
        let imgBlob = imageData;//this.imgURItoBlob("data:image/jpeg;base64," + imageData);
        let metadata = {
          'contentType': imgBlob.type
        };
        // Generate filename and upload to Firebase Storage.
        firebase.storage().ref().child('images/' + groupId + '/' + this.generateFilename()).put(imgBlob, metadata).then(async (snapshot) => {
          // URL of the uploaded image!
          const { metadata } = snapshot;
          let url: any = await firebase.storage().ref(metadata.fullPath).getDownloadURL();
          this.loadingProvider.hide();
          resolve(url);
        }).catch((error) => {
          this.loadingProvider.hide();
          this.alertProvider.showErrorMessage('image/error-image-upload');
        });
      }).catch((error) => {
        this.loadingProvider.hide();
      });
    });
  }


  // ======== set post image ========
  setImage() {
    return new Promise(async (resolve, reject) => {
      this.alert = await this.alertCtrl.create({
        header: 'Send Photo Message',
        message: 'Do you want to take a photo or choose from your photo gallery?',
        buttons: [
          {
            text: 'Cancel',
            handler: data => { }
          },
          {
            text: 'Choose from Gallery',
            handler: () => {
              this.photoMessageOptions.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
              this.camera.getPicture(this.photoMessageOptions).then((imageData) => {
                resolve("data:image/jpeg;base64," + imageData)
              })
            }
          },
          {
            text: 'Take Photo',
            handler: () => {
              this.photoMessageOptions.sourceType = this.camera.PictureSourceType.CAMERA;
              this.camera.getPicture(this.photoMessageOptions).then((imageData) => {
                resolve("data:image/jpeg;base64," + imageData)
              })
            }
          }
        ]
      });
      this.alert.present();
    });
  }

  // ======= upload image in post folder ====
  async uploadPostImage(url: any, userId:any, postId:any) {
    if (url.startsWith('file://') || url.startsWith('cdvphotolibrary://')) {
      url = Capacitor.convertFileSrc(url);
    }
    let imgBlob = this.imgURItoBlob(url);
    let imgMetadata = {
      'contentType': imgBlob.type
    };
    // Generate filename and upload to Firebase Storage.

    let fileName= this.generateFilename()
    const snapshot: any = await firebase.storage().ref().child('images/posts/' +userId+ '/'+postId+'/' + fileName)
      .put(imgBlob, imgMetadata)
      .catch(err => console.log('Error:', err));

    if (!snapshot) return;

    const { metadata } = snapshot;
    let imgUrl: any = await firebase.storage().ref(metadata.fullPath)
      .getDownloadURL()
      .catch(err => console.log('Error', err));

    if (!imgUrl){
      this.alertProvider.showErrorMessage('image/error-image-upload');
      return;
    }
    return [imgUrl, fileName];
}

uploadProductImage(productId, imageData) {
  return new Promise<boolean>((resolve, reject) => {

    let imgBlob = this.imgURItoBlob("data:image/png;base64," +imageData);
    let metadata = {
      'contentType': imgBlob.type
    };
    // Generate filename and upload to Firebase Storage.
    let fileName = this.generateFilenameProduct()
    firebase.storage().ref().child('myZura/products/'+ productId+ '/noBackgroundImages/' + fileName).put(imgBlob, metadata).then(async (snapshot) => {
      // Delete previous profile photo on Storage if it exists.
      console.log('Snapshot', snapshot);
      const { metadata } = snapshot;
      let url: any = await firebase.storage().ref(metadata.fullPath).getDownloadURL();

      console.log('URL', url);

      this.myzuraAPI.addPhotosToProduct({
        "productId" : productId,
        "fullResURL" : url,
        "fileName" : fileName
      })

      resolve(true)


    }).catch((error) => {

      console.log('Error.up', error);
      this.alertProvider.showErrorMessage('image/error-image-upload');
      resolve(false)

    }).catch((error) => {
      console.log('Error.up', error);
      resolve(false)

    });
  })

}

// ======= upload image in story folder ====
uploadStoryImage(url) {
  return new Promise((resolve, reject) => {
    if (url.startsWith('file://') || url.startsWith('cdvphotolibrary://')) {
      url = Capacitor.convertFileSrc(url);
    }

    let imgBlob = this.imgURItoBlob(url);
    let metadata = {
      'contentType': imgBlob.type
    };
    // Generate filename and upload to Firebase Storage.
    firebase.storage().ref().child('images/story/' + this.generateFilename())
      .put(imgBlob, metadata).then(async (snapshot) => {
        // URL of the uploaded image!
        const { metadata } = snapshot;
        let url: any = await firebase.storage().ref(metadata.fullPath).getDownloadURL();
        console.log('result', url);
        resolve(url);
      }).catch((error) => {
        this.alertProvider.showErrorMessage('image/error-image-upload');
        reject(error)
      });
  })
}

// ======= upload image in post folder ====
uploadPostImage64(image) {

  return new Promise((resolve, reject) => {
    image.replace("data:image/octet-stream;base64,", "");
    console.log(image);
    let imgBlob = this.imgURItoBlob("data:image/jpeg;base64," + image);
    let metadata = {
      'contentType': imgBlob.type
    };

    // Generate filename and upload to Firebase Storage.
    firebase.storage().ref().child('images/post/' + this.generateFilename())
      .put(imgBlob, metadata).then(async (snapshot) => {
        // URL of the uploaded image!
        const { metadata } = snapshot;
        let url: any = await firebase.storage().ref(metadata.fullPath).getDownloadURL();
        resolve(url);
      }).catch((error) => {
        this.alertProvider.showErrorMessage('image/error-image-upload');
        reject(error)
      });
  })
}

uploadPostvideo(url) {
  return new Promise((resolve, reject) => {
    let imgBlob = this.imgURItoBlob(url);
    let metadata = {
      'contentType': "video/mp4"
    };
    // Generate filename and upload to Firebase Storage.
    firebase.storage().ref().child('images/post/' + this.generatevideoname()).put(imgBlob, metadata).then(async (snapshot) => {
      // URL of the uploaded image!
      const { metadata } = snapshot;
      let url: any = await firebase.storage().ref(metadata.fullPath).getDownloadURL();
      resolve(url);
    }).catch((error) => {
      this.alertProvider.showErrorMessage('image/error-image-upload');
      reject(error)
    });
  })
}
generatevideoname() {
  var length = 8;
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text + ".mp4";
}




}
