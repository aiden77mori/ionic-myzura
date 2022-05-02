import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController, NavController, NavParams } from '@ionic/angular';
import firebase from 'firebase';
import _ from 'lodash';
import { NativeGeocoder, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CommentsPage } from '../comments/comments';
import { map, take } from 'rxjs/operators';
import { SafeHtml } from '@angular/platform-browser';
import { DataProvider } from 'src/app/services/data.provider';
import { LoadingProvider } from 'src/app/services/loading.provider';
import { FirebaseProvider } from 'src/app/services/firebase.provider';
import { TranslateProvider } from 'src/app/services/translate.service';
import { MixpanelService } from 'src/app/services/mixpanel.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'page-user-info',
  templateUrl: 'user-info.html',
  styleUrls: ['user-info.scss']
})

export class UserInfoPage implements OnInit {
  user: any;
  userId: any;
  currentUser:any;
  private friendRequests: any;
  private requestsSent: any;
  private friends: any;
  private alert: any;
  public timelineData: any;
  following: any;

  categories=[]
  closetList={}
  closetData=[]
  icons = 'reviews';
  numPosts=0

  // UserInfoPage
  // This is the page where the user can view user information, and do appropriate actions based on their relation to the current logged in user.
  constructor(
    public modalCtrl: ModalController,
    public nParams: ActivatedRoute,
    public dataProvider: DataProvider,
    public loadingProvider: LoadingProvider,
    public alertCtrl: AlertController,
    public firebaseProvider: FirebaseProvider,
    private router: Router,
    private navCtrl: NavController,
    public translate: TranslateProvider,
    public mixpanelService: MixpanelService,
    public notifications: NotificationsService) {
      this.nParams.params.subscribe(async queryParams => {
        console.log(queryParams)
        this.userId = queryParams["userId"]
      })

    }


    async getCloset(userId){
      await this.dataProvider.getCLosetByUserId(userId).valueChanges().subscribe((data:any,)=>{
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

  async ngOnInit() {

    // const { userId } = (window as any).history.state;

    // if (!userId) this.location.back();

    // this.userId = userId;
    if(this.userId){
      this.getCloset(this.userId)
      this.dataProvider.getUser(this.userId)
        .valueChanges()
        .subscribe(user => {
          this.user = user;
        }
      );

      this.dataProvider.getCurrentUser().subscribe((user: any) => {
        this.currentUser = user.userId
        if (user.following) {
          this.following = user.following;
        } else {
          this.following = [];
        }
      });

      // Get user info.
      this.dataProvider.getUser(this.userId).valueChanges().pipe(take(1)).subscribe((user) => {
        this.user = user;


        // Get friends of current logged in user.
        this.dataProvider.getUser(firebase.auth().currentUser.uid).valueChanges().subscribe((user: any) => {
          this.friends = user.friends;
        });
        // Get requests of current logged in user.
        this.dataProvider.getRequests(firebase.auth().currentUser.uid).subscribe((requests: any) => {
          if (requests) {
            this.friendRequests = requests.friendRequests;
            this.requestsSent = requests.requestsSent;
          }
        });

        //Getting  User Timeline

        if (this.user.userId) {
          this.timelineData = [];

          this.dataProvider.getInterests(this.user.userId).subscribe((data: any) => {
            console.log('POSTLIST', data);
            let timelineList = data;

            if (timelineList) {
              this.numPosts = 0
              timelineList.forEach(postId => {
                this.dataProvider.getTimeline(postId).snapshotChanges()
                  .pipe(map(snapshot => {
                    let data: any = snapshot.payload.val();
                    return { ...data, postId: snapshot.key }
                  }))
                  .subscribe((post) => {



                    this.loadingProvider.hide();
                    console.log('POST', post);


                    let timeline: any = post;
                    let tempData = <any>{};
                    tempData = timeline;

                    if(tempData.deleted  == false){

                      this.dataProvider.getUser(this.user.userId).valueChanges().subscribe((user: any) => {
                        tempData.avatar = user.photos? user.photos["128"] : user.profilePic;
                        tempData.name = user.name
                        tempData.username = user.username;

                      });


                      tempData.postText = this.createHashtag(tempData.postText);

                      //  ===== check like
                      console.log('tempdata', tempData);
                      this.dataProvider.getLike(postId).subscribe((likes) => {
                        tempData.likes = likes.length;
                        // Check post like or not

                        let isLike = _.findKey(likes, (like) => {
                          let _tempLike = <any>like;
                          return _tempLike == firebase.auth().currentUser.uid;
                        })

                        if (isLike) {
                          tempData.isLike = true;
                        } else {
                          tempData.isLike = false;
                        }
                      });

                      //  ===== check commnets
                      this.dataProvider.getComments(postId).valueChanges().subscribe((comments) => {
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
                      this.numPosts = this.numPosts +1;
                    }
                  });
              });
            }

          });


          if (this.timelineData) {
            this.timelineData = this.timelineData.reduce((acc, val) => {
              if (!acc.find(el => el.postId === val.postId)) {
                acc.push(val);
              }
              return acc;
            }, []);

            this.timelineData.sort(function (a, b) {
              var d1 = new Date(a.dateCreated);
              var d2 = new Date(b.dateCreated);
              return (d1 > d2) ? -1 : ((d2 > d1) ? 1 : 0);
            });
          }
        }
      });

    }
  }

  //get Location
  locationAddress(location, success) {

    // this.nativeGeocoder.reverseGeocode(location.lat, location.long)
    //   .then((result: any) => {
    //     console.log(JSON.stringify(result));
    //     success(result);
    //   }).catch((error: any) => console.log(error));
  }



  // Accept friend request.
  async acceptFriendRequest() {
    this.alert = await this.alertCtrl.create({
      header: 'Confirm Friend Request',
      message: 'Do you want to accept <b>' + this.user.name + '</b> as your friend?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Accept',
          handler: () => {
            this.firebaseProvider.acceptFriendRequest(this.userId);
          }
        }
      ]
    });
    this.alert.present();
  }

  //Create Hashtag Links
  createHashtag(text: String): SafeHtml {
    let str = text;
    if (!str || str === '')
      return '';

    let res = str.split(/[ ]/);
    return res;
  }

  // Deny friend request.
  async rejectFriendRequest() {
    this.alert = await this.alertCtrl.create({
      header: 'Reject Friend Request',
      message: 'Do you want to reject <b>' + this.user.name + '</b> as your friend?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Reject',
          handler: () => {
            this.firebaseProvider.deleteFriendRequest(this.userId);
          }
        }
      ]
    });
    this.alert.present();
  }

  // Cancel friend request sent.
  async cancelFriendRequest() {
    this.alert = await this.alertCtrl.create({
      header: 'Friend Request Pending',
      message: 'Do you want to delete your friend request to <b>' + this.user.name + '</b>?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Delete',
          handler: () => {
            this.firebaseProvider.cancelFriendRequest(this.userId);
          }
        }
      ]
    });
    this.alert.present();
  }

  // Send friend request.
  async sendFriendRequest() {
    this.alert = await this.alertCtrl.create({
      header: 'Send Friend Request',
      message: 'Do you want to send friend request to <b>' + this.user.name + '</b>?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Send',
          handler: () => {
            this.firebaseProvider.sendFriendRequest(this.userId);
          }
        }
      ]
    });
    this.alert.present();
  }

  // Open chat with this user.
  sendMessage() {
    this.router.navigateByUrl('tabs/messages/message', { state: { userId: this.userId } });
  }

  // Check if user can be added, meaning user is not yet friends nor has sent/received any friend requests.
  canAdd() {
    if (this.friendRequests) {
      if (this.friendRequests.indexOf(this.userId) > -1) {
        return false;
      }
    }
    if (this.requestsSent) {
      if (this.requestsSent.indexOf(this.userId) > -1) {
        return false;
      }
    }
    if (this.friends) {
      if (this.friends.indexOf(this.userId) > -1) {
        return false;
      }
    }
    return true;
  }

  openMap(lat, long) {
    window.open('http://maps.google.com/maps?q=' + lat + ',' + long, '_system', 'location=yes')
  }

  // Enlarge image messages.
  // async enlargeImage(img) {
  //   let imageModal = await this.modalCtrl.create({
  //     component: ImageModalPage,
  //     componentProps: { img: img }
  //   });
  //   imageModal.present();
  // }

  //Follow User
  follow(user) {
    this.firebaseProvider.followUser(user.userId);
    this.notifications.sendNotification({
      userId: user.userId,
      type: "Follow",
      username: this.currentUser.username,
      action: this.translate.get('notifications.followed'),
      body:  this.translate.get('notifications.you'),
      senderId: this.currentUser.userId ,
      postId: this.currentUser.userId

    })
    this.mixpanelService.track("FollowUser", {
      sender: this.currentUser.userId,
      receiver: user.userId,
      timestamp: Date.now()
    })
  }

  //unfollow User
  unfollow(user) {
    this.firebaseProvider.unfollowUser(user.userId);
    this.mixpanelService.track("UnfollowUser", {
      sender: this.currentUser.userId,
      receiver: user.userId,
      timestamp: Date.now()
    })
  }

  // Get the status of the user in relation to the logged in user.
  getStatus(user) {

    // Returns:
    // 0 when user can be requested as friend.
    // 1 when a friend request was already sent to this user.
    // 2 when this user has a pending friend request.
    // 3 when this user are being followed yet;
    if (this.requestsSent) {
      for (var i = 0; i < this.requestsSent.length; i++) {
        if (this.requestsSent[i] == user.userId) {
          return 1;
        }
      }
    }

    if (this.friendRequests) {
      for (var i = 0; i < this.friendRequests.length; i++) {
        if (this.friendRequests[i] == user.userId) {
          return 2;
        }
      }
    }
    if (this.following) {
      for (var i = 0; i < this.following.length; i++) {
        if (this.following[i] == user.userId) {
          return 3;
        }
      }
    }
    return 0;
  }

  //view post when square img
  // viewPost(post) {
  //   this.router.navigateByUrl('tabs/view-post', { state: { post } });
  // }

  openOptions(param){

  }

  viewUser(param){

  }

  back = ()=>{
    this.navCtrl.back()
  }

  getFollowers(type){
    this.navCtrl.navigateForward('tabs/users/'+this.user.username+'/'+this.userId+ '/'+type);
  }


}
