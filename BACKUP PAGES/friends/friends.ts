import { Component } from '@angular/core';

import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { DataProvider } from 'src/app/services/data.provider';
import { LoadingProvider } from 'src/app/services/loading.provider';

@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html',
  styleUrls: ['friends.scss']
})
export class FriendsPage {
  public friends: any;
  private friendRequests: any;
  public searchFriend: any;
  // FriendsPage
  // This is the page where the user can search, view, and initiate a chat with their friends.
  constructor(
    public dataProvider: DataProvider,
    public loadingProvider: LoadingProvider,
    private router: Router) { }

  ionViewDidLoad() {
    // Initialize
    this.searchFriend = '';
    this.loadingProvider.show();

    // Get friendRequests to show friendRequests count.
    this.dataProvider.getRequests(firebase.auth().currentUser.uid).subscribe((requests: any) => {
      this.friendRequests = requests.friendRequests;
    });

    // Get user data on database and get list of friends.
    this.dataProvider.getCurrentUser().subscribe((account: any) => {


      if (account.following) {
        for (var i = 0; i < account.following.length; i++) {
          this.dataProvider.getUser(account.following[i]).snapshotChanges().subscribe((friend) => {
            this.addOrUpdateFriend(friend);
          });
        }
      } else {
        this.friends = [];
      }

      if (account.followers) {
        for (var i = 0; i < account.followers.length; i++) {
          this.dataProvider.getUser(account.followers[i]).snapshotChanges().subscribe((friend) => {
            this.addOrUpdateFriend(friend);
          });
        }
      }
      this.loadingProvider.hide();
    });
  }

  // Add or update friend data for real-time sync.
  addOrUpdateFriend(friend) {
    if (!this.friends) {
      this.friends = [friend];
    } else {
      var index = -1;
      for (var i = 0; i < this.friends.length; i++) {
        if (this.friends[i].$key == friend.$key) {
          index = i;
        }
      }
      if (index > -1) {
        this.friends[index] = friend;
      } else {
        this.friends.push(friend);
      }
    }
  }

  // Proceed to searchPeople page.
  searchPeople() {
    this.router.navigateByUrl('tabs/search-people')
  }

  // Proceed to requests page.
  manageRequests() {
    this.router.navigateByUrl('tabs/requests')
  }

  // Proceed to userInfo page.
  viewUser(userId) {
    this.router.navigateByUrl('tabs/user-info', { state: { userId } });
  }

  // Proceed to chat page.
  message(userId) {
    this.router.navigateByUrl('tabs/messages/message', { state: { userId } });
  }
}
