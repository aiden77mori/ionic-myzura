import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import * as firebase from 'firebase';

import _ from 'lodash';
import { CommentsPage } from '../comments/comments';
import { ImageModalPage } from '../image-modal/image-modal';
import { UserInfoPage } from '../user-info/user-info';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { LoadingProvider } from 'src/app/services/loading.provider';
import { AngularFireDatabase } from '@angular/fire/database';
import { DataProvider } from 'src/app/services/data.provider';
import { FirebaseProvider } from 'src/app/services/firebase.provider';


@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html',
  styleUrls: ['favorites.scss']
})
export class FavoritesPage {
  private user: any;
  public timelineData: any;
  public friendsList: any;
  constructor(
    private location: Location,
    private router: Router,
    public loadingProvider: LoadingProvider,
    public angularDb: AngularFireDatabase,
    public dataProvider: DataProvider,
    public firebaseProvider: FirebaseProvider,
    private nativeGeocoder: NativeGeocoder,
    public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    // Observe the userData on database to be used by our markup html.
    // Whenever the userData on the database is updated, it will automatically reflect on our user variable.
    this.loadingProvider.show();
    //this.createUserData();
    this.dataProvider.getCurrentUser().subscribe((user) => {
      this.user = <any>user;
      console.log(this.user)
    });

    //Getting Current User
    this.dataProvider.getCurrentUser().subscribe((user: any) => {
      this.timelineData = [];
      const { bookmark } = user;
      let tempData;
      console.log(bookmark);
      if (bookmark) {
        bookmark.forEach(postId => {
          this.dataProvider.getTimeline(postId).snapshotChanges().subscribe((post: any) => {
            this.loadingProvider.hide();

            let timeline = post;
            let tempData = <any>{};
            tempData = timeline;


            this.dataProvider.getUser(timeline.postBy).snapshotChanges().subscribe((user: any) => {
              tempData.avatar = user.photos? user.photos["128"] : user.profilePic;
              tempData.name = user.name
            });

            // Check Location
            if (timeline.location && timeline.location !== "Mohali") {
              let tempLocaion = JSON.parse(timeline.location);
              tempData.lat = tempLocaion.lat;
              tempData.long = tempLocaion.long;
              this.locationAddress(tempLocaion, (address: any) => {
                tempData.locationAddress = address.locality + ", " + address.countryCode;
                console.log(tempData.locationAddress);
              });
            }

            //  ===== check like
            this.dataProvider.getLike(tempData.$key).subscribe((likes) => {
              tempData.likes = likes.length;
              // Check post like or not

              let isLike = _.findKey(likes, (like) => {
                let _tempLike = <any>like;
                return _tempLike.$value == firebase.auth().currentUser.uid;
              })

              if (isLike) {
                tempData.isLike = true;
              } else {
                tempData.isLike = false;
              }
            });

            //  ===== check commnets
            this.dataProvider.getComments(tempData.$key).snapshotChanges().subscribe((comments) => {
              // console.log("====comm",comments)
              tempData.comments = comments.length;
              // Check post like or not

              let isComments = _.findKey(comments, (comment) => {
                let _tempComment = <any>comment;
                return _tempComment.commentBy == firebase.auth().currentUser.uid;
              })

              if (isComments) {
                tempData.isComment = true;
              } else {
                tempData.isComment = false;
              }

            });
            console.log(tempData);
            // this.addOrUpdateTimeline(tempData)
            this.timelineData.unshift(tempData);
          });

        });
      } else { this.loadingProvider.hide(); }
    });
  }

  // Create userData on the database if it doesn't exist yet.
  createUserData() {
    firebase.database().ref('accounts/' + firebase.auth().currentUser.uid).once('value')
      .then((account) => {
        // No database data yet, create user data on database
        if (!account.val()) {
          this.loadingProvider.show();
          let user = firebase.auth().currentUser;
          var userId, name, provider, img, email;
          let providerData = user.providerData[0];

          userId = user.uid;

          // Get name from Firebase user.
          if (user.displayName || providerData.displayName) {
            name = user.displayName;
            name = providerData.displayName;
          } else {
            name = "Firebase User";
          }

          // Set default username based on name and userId.
          let username = name.replace(/ /g, '') + userId.substring(0, 8);

          // Get provider from Firebase user.
          if (providerData.providerId == 'password') {
            provider = "Firebase";
          } else if (providerData.providerId == 'facebook.com') {
            provider = "Facebook";
          } else if (providerData.providerId == 'google.com') {
            provider = "Google";
          }

          // Get photoURL from Firebase user.
          if (user.photoURL || providerData.photoURL) {
            img = user.photoURL;
            img = providerData.photoURL;
          } else {
            img = "assets/images/profile.png";
          }

          // Get email from Firebase user.
          email = user.email;

          // Set default description.
          let description = "Hello! I am a new facebookclone user.";

          // Insert data on our database using AngularFire.
          this.angularDb.object('/accounts/' + userId).set({
            userId: userId,
            name: name,
            username: username,
            provider: provider,
            img: img,
            email: email,
            description: description,
            dateCreated: new Date().toString()
          }).then(() => {
            this.loadingProvider.hide();
          });
        }
      });
  }

  // Add or update timeline data for real-time sync.
  addOrUpdateTimeline(timeline) {
    if (!this.timelineData) {
      this.timelineData = [timeline];
    } else {
      var index = -1;
      for (var i = 0; i < this.timelineData.length; i++) {
        if (this.timelineData[i].$key == timeline.$key) {
          index = i;
        }
      }
      if (index > -1) {
        this.timelineData[index] = timeline;
      } else {
        this.timelineData.unshift(timeline);
      }
    }
  }


  likePost(post) {
    this.firebaseProvider.likePost(post.$key)
  }

  bookmarkPost(post) {
    console.log(post.$key);
    this.firebaseProvider.bookmarkPost(post.$key);
  }

  isFavorite(post) {
    const { bookmark } = this.user;

    if (!bookmark)
      return false;

    if (bookmark.indexOf(post.$key) !== -1)
      return true;

    return false;
  }

  delikePost(post) {
    this.firebaseProvider.delikePost(post.$key)
  }

  async commentPost(post) {
    let modal = await this.modalCtrl.create({
      component: CommentsPage,
      componentProps: { postKey: post.$key }
    });
    modal.present();
  }

  openMap(lat, long) {
    window.open('http://maps.google.com/maps?q=' + lat + ',' + long, '_system', 'location=yes')
  }

  // Enlarge image messages.
  async enlargeImage(img) {
    let imageModal = await this.modalCtrl.create({
      component: ImageModalPage,
      componentProps: { img: img }
    });
    imageModal.present();
  }

  locationAddress(location, success) {

    // this.nativeGeocoder.reverseGeocode(location.lat, location.long)
    //   .then((result: any) => {
    //     console.log(JSON.stringify(result));
    //     success(result);
    //   }).catch((error: any) => console.log(error));
  }

  //View User  
  viewUser(userId) {
    this.router.navigateByUrl('tabs/user-info', { state: { userId } });
  }

}
