import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DataProvider } from 'src/app/services/data.provider';
import { LoadingProvider } from 'src/app/services/loading.provider';
import { AngularFireDatabase } from '@angular/fire/database';
import { AlertProvider } from 'src/app/services/alert.provider';
import { FirebaseProvider } from 'src/app/services/firebase.provider';
import { TranslateProvider } from 'src/app/services/translate.service';

@Component({
  selector: 'page-search-people',
  templateUrl: 'search-people.html',
  styleUrls: ['search-people.scss']
})
export class SearchPeoplePage {
  public accounts: any;
  public alert: any;
  public account: any;
  public excludedIds: any = [];
  public following: any;
  public searchUser: any;
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
    private router: Router,
    private navCtrl: NavController,
    
    ) { }

  ionViewDidEnter() {
    // Initialize
    this.searchUser = '';
    // Get all users.
    this.dataProvider.getUsers().query.once("value", ((accounts) => {
      this.accounts = Object.values(accounts.val())

      console.log(accounts)
      this.dataProvider.getCurrentUser().subscribe((account: any) => {
        console.log('excludes', account);
        // Add own userId as exludedIds.
        this.excludedIds = [];
        this.account = account;
        // if (this.excludedIds.indexOf(account.userId) == -1) {
        //   this.excludedIds.push(account.userId);
        // }
        // Get friends which will be filtered out from the list using searchFilter pipe pipes/search.ts.
        if (account.friends) {
          account.friends.forEach(friend => {

            if (this.excludedIds.indexOf(friend) == -1) {
              this.excludedIds.push(friend);
            }
          });
        }

        //Get Following Users
        this.following = [];
        if (account.following) {
          this.following = account.following;
        }

        // // Get requests of the currentUser.
        // this.dataProvider.getRequests(account.userId).subscribe((requests: any) => {
        //   if (requests) {
        //     this.requestsSent = requests.requestsSent;
        //     this.friendRequests = requests.friendRequests;
        //   }
        // });
      });


    })
    );
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
    if (this.following) {
      for (var i = 0; i < this.following.length; i++) {
        if (this.following[i] == user.userId) {
          return 3;
        }
      }
    }
    return 0;
  }

  //Follow User
  follow(user) {
    console.log(user)
    this.firebaseProvider.followUser(user.userId);
  }

  //unfollow User
  unfollow(user) {
    this.firebaseProvider.unfollowUser(user.userId);
  }

  // View user.
  viewUser(userId) {
    console.log(userId);
    if(userId == this.firebaseProvider.getCurrentUserId()){
      this.navCtrl.navigateForward('tabs/profile');
    }else{
      this.navCtrl.navigateForward('tabs/user-info/'+userId);
    }
  }

  isCurrentUser(userId){
    return this.firebaseProvider.getCurrentUserId() == userId;
  }

  back(){
    this.navCtrl.back();
  }

}
