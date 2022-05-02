import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DataProvider } from 'src/app/services/data.provider';
import { LoadingProvider } from 'src/app/services/loading.provider';
import { AngularFireDatabase } from '@angular/fire/database';
import { AlertProvider } from 'src/app/services/alert.provider';
import { FirebaseProvider } from 'src/app/services/firebase.provider';
import { TranslateProvider } from 'src/app/services/translate.service';
import { MixpanelService } from 'src/app/services/mixpanel.service';

@Component({
  selector: 'page-followers',
  templateUrl: 'followers.html',
  styleUrls: ['followers.scss']
})
export class FollowersPage {

  public accounts: any;
  public alert: any;
  public account: any;
  public excludedIds: any = [];

  public following: any;
  public followingMe: any; //to check if its following me
  public searchUser: any;

  public type : any;
  // SearchPeoplePage
  // This is the page where the user can search for other users and send a friend request.
  constructor(
    public dataProvider: DataProvider,
    public loadingProvider: LoadingProvider,
    public alertCtrl: AlertController,
    public translate: TranslateProvider,
    public angularDb: AngularFireDatabase,
    public alertProvider: AlertProvider,
    public firebaseProvider: FirebaseProvider,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private mixpanelService: MixpanelService
    ) { }

  ngOnInit() {

    this.route.params.subscribe(async queryParams => {
      console.log(queryParams)
      let userId = queryParams["userId"]
      this.type = queryParams["type"]

       // Initialize
    this.loadingProvider.show();
    // Get all users.
    this.dataProvider.getUser(userId).valueChanges().subscribe(async (account: any) => {
      this.loadingProvider.hide();
      this.searchUser = '';

      console.log('excludes', account);
      // Add own userId as exludedIds.
      this.excludedIds = [];
      this.account = account;


      //THIS IS IMPORTANT FOR IT TO WORK
      if (this.excludedIds.indexOf(account.userId) == -1) {
        this.excludedIds.push(account.userId);
      }
      


      // // Get friends which will be filtered out from the list using searchFilter pipe pipes/search.ts.
      // if (account.friends) {
      //   account.friends.forEach(friend => {

      //     if (this.excludedIds.indexOf(friend) == -1) {
      //       this.excludedIds.push(friend);
      //     }
      //   });
      // }


      if(userId == this.firebaseProvider.getCurrentUserId()){
      }else{
        this.dataProvider.getCurrentUser().subscribe(async (user:any) => {
          this.followingMe = [];
         
          this.followingMe = user.following;
        });
  
      }


      this.following = [];
      let auxAccounts = []
      this.accounts = []

      //Get Following Followers Users: ALWAYS
      this.following = account.following;

      if(this.type=="following"){
        if (account.following) {
          auxAccounts = this.following
        }
      }else{
        if (account.followers) {
          auxAccounts = account.followers;
        }
      }


      //IMPORTANT THIS HELPS HAVE ALL PROMISES CALLED AND HAVE DATA READY BEFORE USAGE IN NGFOR

      let promisesToHandle = []
      let accounts = []
      for (var i = 0; i < auxAccounts.length; i++) {
       let promise =  this.dataProvider.getUserRef(auxAccounts[i]).once('value', (accountRes) => {
          accounts.push(accountRes.val())
        })
        promisesToHandle.push(promise)
      }

      await Promise.all(promisesToHandle)

      if(userId == this.firebaseProvider.getCurrentUserId()){
        this.followingMe  = this.following
      }else{
        this.dataProvider.getCurrentUser().subscribe(async (user:any) => {
          this.followingMe = [];
          this.followingMe = user.following;
        });
  
      }
      this.accounts = accounts
      // // Get requests of the currentUser.
      // this.dataProvider.getRequests(account.userId).subscribe((requests: any) => {
      //   if (requests) {
      //     this.requestsSent = requests.requestsSent;
      //     this.friendRequests = requests.friendRequests;
      //   }
      // });
    });
  });


   
  }



  // Get the status of the user in relation to the logged in user.
  getStatus(user) {
    // Returns:
    // 0 when user can be requested as friend.
    // 1 when a friend request was already sent to this user.
    // 2 when this user has a pending friend request.
    // 3 when this user are being followed yet;
    // if (this.requestsSent) {
    //   for (var i = 0; i < this.requestsSent.length; i++) {
    //     if (this.requestsSent[i] == user.userId) {
    //       return 1;
    //     }
    //   }
    // }
    // if (this.friendRequests) {
    //   for (var i = 0; i < this.friendRequests.length; i++) {
    //     if (this.friendRequests[i] == user.userId) {
    //       return 2;
    //     }
    //   }
    // }
    if (this.followingMe) {
      for (var i = 0; i < this.followingMe.length; i++) {
        if (this.followingMe[i] == user.userId) {
          return 3;
        }
      }
    }
    return 0;
  }

  // Send friend request.
  async sendFriendRequest(user) {
    this.alert = await this.alertCtrl.create({
      header: 'Send Friend Request',
      message: 'Do you want to send friend request to <b>' + user.name + '</b>?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Send',
          handler: () => {
            this.firebaseProvider.sendFriendRequest(user.$key);
          }
        }
      ]
    });
    this.alert.present();
  }

  // Cancel friend request sent.
  async cancelFriendRequest(user) {
    this.alert = await this.alertCtrl.create({
      header: 'Friend Request Pending',
      message: 'Do you want to delete your friend request to <b>' + user.name + '</b>?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Delete',
          handler: () => {
            this.firebaseProvider.cancelFriendRequest(user.$key);
          }
        }
      ]
    });
    this.alert.present();
  }

  // Accept friend request.
  async acceptFriendRequest(user) {
    this.alert = await this.alertCtrl.create({
      header: 'Confirm Friend Request',
      message: 'Do you want to accept <b>' + user.name + '</b> as your friend?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Reject Request',
          handler: () => {
            this.firebaseProvider.deleteFriendRequest(user.$key);
          }
        },
        {
          text: 'Accept Request',
          handler: () => {
            this.firebaseProvider.acceptFriendRequest(user.$key);
          }
        }
      ]
    });
    this.alert.present();
  }

  //Follow User
  follow(user) {
    this.mixpanelService.track("FollowUser", {
      user: user.userId,
      source: "FollowersList",
      timestamp: Date.now()
    })

    console.log(user)
    this.firebaseProvider.followUser(user.userId);
  }

  //unfollow User
  unfollow(user) {
    this.mixpanelService.track("UnfollowUser", {
      user: user.userId,
      source: "FollowersList",
      timestamp: Date.now()
    })
    this.firebaseProvider.unfollowUser(user.userId);
  }

  // View user.
  viewUser(userId) {

    this.mixpanelService.track("ViewUser", {
      source: "FollowersList",
      userId: userId,
      timestamp: Date.now()
    })
    console.log(userId);
    if(userId == this.firebaseProvider.getCurrentUserId()){
      this.navCtrl.navigateForward('tabs/profile');
    }else{
      this.navCtrl.navigateForward('tabs/user-info/'+userId);
    }
  }



  back(){
    this.navCtrl.back();
  }


  isCurrentUser(userId){
    return this.firebaseProvider.getCurrentUserId() == userId;
  }
}
