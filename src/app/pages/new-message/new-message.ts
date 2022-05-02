import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DataProvider } from 'src/app/services/data.provider';
import { LoadingProvider } from 'src/app/services/loading.provider';
import { TranslateProvider } from 'src/app/services/translate.service';

@Component({
  selector: 'page-new-message',
  templateUrl: 'new-message.html',
  styleUrls: ['new-message.scss']
})
export class NewMessagePage {
  friends: any;
  searchFriend: any;
  // NewMessagePage
  // This is the page where the user are asked to select a friend whom they want to start a conversation with.
  constructor(
    public dataProvider: DataProvider,
    public loadingProvider: LoadingProvider,
    public translate: TranslateProvider,    

    private router: Router,
    private location : Location) { }

  ionViewDidEnter() {
    // Initialize
    this.searchFriend = '';
    this.loadingProvider.show();

    // Get user's friends.
    this.dataProvider.getCurrentUser().subscribe((account: any) => {
      if (account.following) {
        for (var i = 0; i < account.following.length; i++) {
          this.dataProvider.getUser(account.following[i]).valueChanges().subscribe((friend) => {
            this.addOrUpdateFriend(friend);
          });
        }
      } else {
        this.friends = [];
      }

      if (account.followers) {
        for (var i = 0; i < account.followers.length; i++) {
          this.dataProvider.getUser(account.followers[i]).valueChanges().subscribe((friend) => {
            this.addOrUpdateFriend(friend);
          });
        }
      }
      this.loadingProvider.hide();
    });
  }

  // Back
  back() {
    this.location.back();
  }

  // Add or update friend for real-time sync.
  addOrUpdateFriend(friend) {
    console.log('adding new conversation',friend);
    if (!this.friends) {
      this.friends = [friend];
    } else {
      var index = -1;
      for (var i = 0; i < this.friends.length; i++) {
        if (this.friends[i].userId == friend.userId) {
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

  // Search people.
  searchPeople() {
    this.router.navigateByUrl('tabs/search-people');
  }

  // Open chat with this user.
  message(userId) {
    console.log(userId)
    this.router.navigateByUrl('tabs/messages/message', { state: { userId } });
  }
}
