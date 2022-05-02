import { Component, OnInit } from '@angular/core';
import { AlertController, PopoverController, ModalController, NavController } from '@ionic/angular';
import firebase from 'firebase';
import { Camera } from '@ionic-native/camera/ngx';
import _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';

 import { SafeHtml } from '@angular/platform-browser';

import { AngularFireDatabase } from '@angular/fire/database';

import { Validator } from '../../../validator';
import { LogoutProvider } from '../../services/logout.provider';
import { LoadingProvider } from '../../services/loading.provider';
import { ImageProvider } from '../../services/image.provider';
import { AlertProvider } from '../../services/alert.provider';
import { DataProvider } from '../../services/data.provider';
import { FirebaseProvider } from '../../services/firebase.provider';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { TranslateProvider } from 'src/app/services/translate.service';
import { SampleShellListingModel } from 'src/app/services/shell/sample-shell.model';
 import { FeedProvider } from 'src/app/services/feed.provider';


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  styleUrls: ['profile.scss']
})
export class ProfilePage implements OnInit{

  routePostsResolveData: SampleShellListingModel;
  savedPosts: any = [];

  public user: any;
  private alert: any;
  public timelineData: any;
  public favoriteTimeline: any;
  public icons = 'reviews';
  public loading: boolean = true;

  categories=[]
  closetList={}
  closetData=[]
  closetPlusData = []
  // HomePage
  // This is the page where the user is directed after successful login and email is confirmed.
  // A couple of profile management function is available for the user in this page such as:
  // Change name, profile pic, email, and password
  // The user can also opt for the deletion of their account, and finally logout.
  constructor(
    public alertCtrl: AlertController,
        public translate: TranslateProvider,

    private router: Router,
    public navCtrl: NavController,
    public logoutProvider: LogoutProvider,
    public loadingProvider: LoadingProvider,
    public imageProvider: ImageProvider,
    public angularDb: AngularFireDatabase,
    public alertProvider: AlertProvider,
    public dataProvider: DataProvider,
    public feedProvider: FeedProvider,
    public camera: Camera,
    private nativeGeocoder: NativeGeocoder,
    private popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
    public firebaseProvider: FirebaseProvider,
    private route: ActivatedRoute
    ) {
      this.logoutProvider.setRouter(this.router);
  }


  ionViewWillEnter() {
    this.getCloset();
  }

  async getCloset(){
    await this.dataProvider.getCLoset().valueChanges().subscribe((data:any,)=>{
      this.closetData = []
      if(data){

        //very important to keep key
      let dataAux:any = Object.entries(data)
       dataAux = dataAux.reverse()
        this.getClosetData(dataAux).then((closetData:any)=>{
          this.categories = _.uniq(_.map(closetData, "category"))
          this.closetList = {}
          this.categories.forEach(c=>{
            this.closetList[c] = {
              name:c,
              photo:"",
              total:0,
              products:[]
            }
          })

          closetData.forEach(d=>{
            if(!this.closetList[d.category].photo){
              this.closetList[d.category].photo = d.photos[256]
            }
            this.closetList[d.category].products.push(d)
            this.closetList[d.category].total +=1
          })
          console.log((this.closetList))
        })
      }

    })
  }

  getProductByClosetProduct(product){
    return new Promise((resolve, reject)=>{
      this.dataProvider.getProductById(product[1].productId ).query.once("value",(snapshot)=>{
        let productData ={}

        if(snapshot){
          snapshot.forEach(snap => {
            productData[snap.key] = snap.val();
          });
          resolve({...productData, key: product[0] })
        }else{
          resolve({key: product[0] })

        }
       })
    })
  }
  getClosetData(products){
    let closetData =[]
    return new Promise(async (resolve, reject)=>{
     for(var i=0; i<products.length; i++){
       await this.getProductByClosetProduct(products[i]).then(p => {
        closetData.push(p)
       })
     }
     resolve(closetData)
    })
  }

  async loadData(evt: any){
    //Getting closet data
    // this.getCloset();
    this.getClosetPlus();
    evt.target.complete();
  }

  async getClosetPlus(){
    await this.dataProvider.getCLosetPlus().valueChanges().subscribe((data:any)=>{

      this.closetPlusData = []
      if(data){


       //very important to keep key
       let dataAux:any = Object.entries(data)
       dataAux = dataAux.reverse()
       dataAux.forEach(async product => {
         console.log( product[0] )
        await this.dataProvider.getProductById(product[1].productId ).snapshotChanges().subscribe((snapshot)=>{
          let productData ={}

          if(snapshot){
            snapshot.forEach(snap => {
              productData[snap.key] = snap.payload.val();
            });
            this.closetPlusData.push({...productData, key: product[0] })
          }
         })
      });


      }

    })
  }
 ngOnInit() {
    // Observe the userData on database to be used by our markup html.
    // Whenever the userData on the database is updated, it will automatically reflect on our user variable.


    //Getting closet data
    this.getCloset();
    this.getClosetPlus();

    this.dataProvider.getCurrentUser().subscribe(async(user) => {
      this.user = <any>user;
      let promises = []
      this.savedPosts = []
      this.user.bookmark?.forEach(post => {
        let promise = this.feedProvider.getTimelineById(post).then((postData:any)=>{
          console.log(postData.deleted)
          if(postData.deleted == false){
            this.savedPosts.push(postData)
          }
        })
        promises.push(promise)
      });

      await Promise.all(promises);
      console.log('User saved posts',  this.savedPosts);
    });

    if (this.route && this.route.data) {
      // We resolved a promise for the data Observable
      const promiseObservable = this.route.data;
      console.log('Progressive Shell Resovlers - Route Resolve Observable => promiseObservable: ', promiseObservable);

      if (promiseObservable) {
        promiseObservable.subscribe(promiseValue => {
          const dataObservable = promiseValue['data'];
          console.log('Progressive Shell Resovlers - Subscribe to promiseObservable => dataObservable: ', dataObservable);

          if (dataObservable) {
            dataObservable.subscribe(observableValue => {
              const pageData: SampleShellListingModel = observableValue;
              // tslint:disable-next-line:max-line-length
              console.log('Progressive Shell Resovlers - Subscribe to dataObservable (can emmit multiple values) => PageData (' + ((pageData && pageData.isShell) ? 'SHELL' : 'REAL') + '): ', pageData);
              // As we are implementing an App Shell architecture, pageData will be firstly an empty shell model,
              // and the real remote data once it gets fetched
              //FIX THIS FOR PERFORMANCE!!!!!!!!

              if ( !pageData.isShell) {
                if(JSON.stringify(pageData?.items)!=JSON.stringify(this.routePostsResolveData?.items)){
                  this.routePostsResolveData = pageData;
                  console.log(this.routePostsResolveData)
                  this.loading = false;
                }
              }
            });
          } else {
            console.warn('No dataObservable coming from Route Resolver promiseObservable');
          }
        });
      } else {
        console.warn('No promiseObservable coming from Route Resolver data');
      }
    } else {
      console.warn('No data coming from Route Resolver');
    }

    //Getting Current User
    // this.dataProvider.getTimelines().subscribe((timeline) => {
    //   this.timelineData = [];

    //   if (timeline) {
    //     timeline.map((data: any) => {
    //       this.dataProvider.getTimeline(data)
    //         .valueChanges()
    //         .pipe(take(1))
    //         .subscribe((post) => {

    //         let timeline: any = post;
    //         let tempData = <any>{};
    //         tempData = timeline;

    //         tempData.postId = data;

    //         this.dataProvider.getUser(timeline.postBy).valueChanges().subscribe((user: any) => {
    //           tempData.avatar = user.img;
    //           tempData.name = user.name
    //         });

    //         // Check Location
    //         if (timeline.location && timeline.location !== "Mohali") {
    //           let tempLocaion = JSON.parse(timeline.location);
    //           tempData.lat = tempLocaion.lat;
    //           tempData.long = tempLocaion.long;
    //           this.locationAddress(tempLocaion, (res: any) => {
    //             let address = res[0];
    //             tempData.locationAddress = address.subAdministrativeArea + ", " + address.countryCode;
    //             console.log(tempData.locationAddress);
    //           });
    //         }

    //         //  ===== check like
    //         console.log('tempdata', tempData);
    //         this.dataProvider.getLike(tempData.postId).subscribe((likes) => {
    //           tempData.likes = likes.length;
    //           // Check post like or not

    //           let isLike = _.findKey(likes, (like) => {
    //             let _tempLike = <any>like;
    //             return _tempLike == firebase.auth().currentUser.uid;
    //           })

    //           if (isLike) {
    //             tempData.isLike = true;
    //           } else {
    //             tempData.isLike = false;
    //           }
    //         });

    //         tempData.postText = this.createHashtag(tempData.postText);

    //         //  ===== check commnets
    //         this.dataProvider.getComments(tempData.postId).valueChanges().subscribe((comments) => {
    //           tempData.comments = comments.length;
    //           // Check post like or not

    //           let isComments = _.findKey(comments, (comment) => {
    //             let _tempComment = <any>comment;
    //             return _tempComment.commentBy == firebase.auth().currentUser.uid;
    //           })

    //           if (isComments) {
    //             tempData.isComment = true;
    //           } else {
    //             tempData.isComment = false;
    //           }

    //         });
    //         console.log('Profile',tempData);
    //         this.addOrUpdateTimeline(tempData)
    //         // this.timelineData.unshift(tempData);:
    //       });

    //     });
    //   }
    // });


    //favorite
    // this.dataProvider.getCurrentUser().pipe(take(1)).subscribe(async (user: any) => {
    //   this.favoriteTimeline = [];
    //   const { bookmark , timeline } = user;
    //   console.log('profile',bookmark);
    //   if (bookmark) {
    //     bookmark.forEach(postId => {
    //       this.dataProvider.getTimeline(postId).valueChanges().subscribe((post) => {

    //         let timeline: any = post;
    //         let tempData = <any>{};
    //         tempData = timeline;


    //         this.dataProvider.getUser(timeline.postBy).valueChanges().subscribe((user: any) => {
    //           tempData.avatar = user.img;
    //           tempData.name = user.name
    //         });

    //         // Check Location
    //         if (timeline.location && timeline.location !== "Mohali") {
    //           let tempLocaion = JSON.parse(timeline.location);
    //           tempData.lat = tempLocaion.lat;
    //           tempData.long = tempLocaion.long;
    //           this.locationAddress(tempLocaion, (address: any) => {
    //             tempData.locationAddress = address.locality + ", " + address.countryCode;
    //             console.log(tempData.locationAddress);
    //           });
    //         }

    //         tempData.postText = this.createHashtag(tempData.postText);

    //         //  ===== check like
    //         this.dataProvider.getLike(tempData.postId).subscribe((likes) => {
    //           tempData.likes = likes.length;
    //           // Check post like or not

    //           let isLike = _.findKey(likes, (like) => {
    //             let _tempLike = <any>like;
    //             return _tempLike.$value == firebase.auth().currentUser.uid;
    //           })

    //           if (isLike) {
    //             tempData.isLike = true;
    //           } else {
    //             tempData.isLike = false;
    //           }
    //         });

    //         //  ===== check commnets
    //         this.dataProvider.getComments(tempData.postId).valueChanges().subscribe((comments) => {
    //           tempData.comments = comments.length;
    //           // Check post like or not

    //           let isComments = _.findKey(comments, (comment) => {
    //             let _tempComment = <any>comment;
    //             return _tempComment.commentBy == firebase.auth().currentUser.uid;
    //           })

    //           if (isComments) {
    //             tempData.isComment = true;
    //           } else {
    //             tempData.isComment = false;
    //           }

    //         });
    //         console.log('favTimeline', tempData);
    //         // this.addOrUpdateTimeline(tempData);
    //         this.favoriteTimeline.unshift(tempData);
    //       });

    //     });
    //   } else { this.loadingProvider.hide(); }
    //   this.timelineData = []
    //   if (timeline) {
    //     const LENGTH_TIMELINE = timeline.length
    //     timeline.forEach(postId => {
    //       this.dataProvider.getTimeline(postId).valueChanges().subscribe((post) => {

    //         let timeline: any = post;
    //         let tempData = <any>{};
    //         tempData = timeline;
    //         tempData.postText =  this.createHashtag(tempData.postText);
    //         //not needed here
    //         this.dataProvider.getUser(timeline.postBy).valueChanges().subscribe((user: any) => {
    //           tempData.avatar = user.photos? user.photos["128"] : user.profilePic;
    //           tempData.name = user.name
    //           tempData.username = user.username

    //           //important

    //           tempData.dateCreated = new Date(tempData.dateCreated)
    //           if (!this.timelineData.find(el => el.image === tempData.image)) {
    //             this.timelineData.push(tempData)
    //           }
    //           console.log(LENGTH_TIMELINE,this.timelineData.length)
    //           if(this.timelineData.length== LENGTH_TIMELINE) {this.loading = false;}

    //         });


    //       });
    //     });

    //     // this.timelineData = this.timelineData.reduce((acc, val) => {
    //     //   if (!acc.find(el => el.postId === val.postId)) {
    //     //     acc.push(val);
    //     //   }
    //     //   return acc;
    //     // }, []);
    //     // if (this.timelineData && this.timelineData.length > 0) {
    //     //   console.log('TIME BEFORE', this.timelineData)

    //     //   this.timelineData.sort(function (a, b) {
    //     //     var d1 = new Date(a.dateCreated);
    //     //     var d2 = new Date(b.dateCreated);
    //     //     return (d1 > d2) ? -1 : ((d2 > d1) ? 1 : 0);
    //     //   });
    //     //   console.log('TIME AFTER', this.timelineData)

    //     // }

    //   } else { this.loadingProvider.hide(); }




    // });
  }




  // Add or update timeline data for real-time sync.
  addOrUpdateTimeline(timeline) {
    if (!this.timelineData) {
      this.timelineData = [timeline];
    } else {
      var index = -1;
      for (var i = 0; i < this.timelineData.length; i++) {
        console.log('addorupdate1', this.timelineData[i]);
        console.log('addorupdate2', timeline);

        if (this.timelineData[i].postId === timeline.postId) {
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

  goSettings() {
    this.navCtrl.navigateForward('tabs/profile/settings');
  }

  //Create Hashtag Links
  createHashtag(text: String): SafeHtml {
    let str = text;
    if (!str || str === '')
      return '';

    let res = str.split(/[ ]/);
    return res;
  }



  presentOptions(event, post) {
    // let popover = this.popoverCtrl.create(PostOptionsComponent,{key: post.$key, value: post.$value});
    // popover.present({
    //   ev: event
    // });
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
            console.log('Gallery');
            this.imageProvider.setProfilePhoto(this.user, this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Take Photo',
          handler: () => {
            // Call imageProvider to process, upload, and update user photo.
            this.imageProvider.setProfilePhoto(this.user, this.camera.PictureSourceType.CAMERA);
          }
        }
      ]
    });
    this.alert.present();
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
          value: this.user.name
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

  //Set username
  async setUsername() {
    this.alert = await this.alertCtrl.create({
      header: 'Change Username',
      message: "Please enter a new username.",
      inputs: [
        {
          name: 'username',
          placeholder: 'Your Username',
          value: this.user.username
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
              this.dataProvider.getUserWithUsername(username).valueChanges().subscribe((userList) => {
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

  //Set description
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

  locationAddress(location, success) {

    // this.nativeGeocoder.reverseGeocode(location.lat, location.long)
    //   .then((result: any) => {
    //     console.log(JSON.stringify(result));
    //     success(result);
    //   }).catch((error: any) => console.log(error));
  }


  openMap(lat, long) {
    window.open('http://maps.google.com/maps?q=' + lat + ',' + long, '_system', 'location=yes')
  }


  //view post when square img
  viewPost(post) {
    // this.navCtrl.navigateForward('tabs/profile/view-post', { state: { post } });
    this.navCtrl.navigateForward('tabs/review/'+ post.postId);

  }

  openOptions(param){

  }
  viewUser(param){

  }

  getFollowers(type){
    this.navCtrl.navigateForward('tabs/users/'+this.user.username+'/'+this.user.userId+ '/'+type);
  }


  openNotifications(){
    this.navCtrl.navigateForward('tabs/notifications');
  }


  // new(){
  //   let data = []
  //   let count = 0
  //   for (let i = 1; i <= 5; i++) {
  //     for (let j = 1; j <= 5; j++) {
  //       data[count] = "" + i + j
  //       count++;
  //     }
  //   }
  //   let save = {}
  //   data.forEach((d, i)=>{
  //     save[data[i]]="https://firebasestorage.googleapis.com/v0/b/myzura-7e808.appspot.com/o/images%2FprofilePhotos%2FQfMRnmcpEkgJb5wQl9Q1e1HmBf82%2Fthumb_256_Scw2ZFOI.jpg?alt=media&token=0964202a-73ea-4488-8b77-f2392bd267ee"
  //   })

  //   this.dataProvider.angularDb.database.ref("defaultData/bodyTypes/male/").set(save)


  //   this.dataProvider.angularDb.database.ref("defaultData/bodyTypes/female/").set(save)

  // }
}
