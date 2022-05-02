import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { DataProvider } from 'src/app/services/data.provider';
import { FirebaseProvider } from 'src/app/services/firebase.provider';
import { MixpanelService } from 'src/app/services/mixpanel.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { TranslateProvider } from 'src/app/services/translate.service';
 

/**
 * This page show us user's friends posts 
 * and following users posts
 *
 */

@Component({
  selector: 'app-user-list',
  templateUrl: 'user-list.html',
  styleUrls: ['user-list.scss']
})
export class UserListComponent {

  user
  @Input() title:any =""
  @Input() accounts:any;
  // @Input() requestsSent:any;
  // @Input() friendRequests:any;
  @Input() following:any;
 

  constructor(
    public modalCtrl: ModalController,
    public dataProvider: DataProvider,
    public navCtrl: NavController,
    public firebaseProvider: FirebaseProvider,
    public mixpanelService: MixpanelService,
    public notifications: NotificationsService,
    public translate: TranslateProvider

    // public storyService: StoryService
    ) {

      this.dataProvider.getUser(this.firebaseProvider.getCurrentUserId()).valueChanges().pipe(take(1)).subscribe((user: any) => { 
        this.user = user;     
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

    this.notifications.sendNotification({
      userId: user.userId,
      type: "Follow",
      username: this.user.username,
      action: this.translate.get('notifications.followed'),
      body:  this.translate.get('notifications.you'),
      senderId: this.user.userId ,
      postId: this.user.userId

    })
    this.mixpanelService.track("FollowUser", {
      sender: this.user.userId,
      receiver: user.userId,
      timestamp: Date.now()
    })
  }

  //unfollow User
  unfollow(user) {
    this.firebaseProvider.unfollowUser(user.userId);
    this.mixpanelService.track("UnfollowUser", {
      sender: this.user.userId,
      receiver: user.userId,
      timestamp: Date.now()
    })
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
