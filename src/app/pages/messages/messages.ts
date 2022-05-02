import { Component, OnInit } from '@angular/core';

import firebase from 'firebase';
import { Router } from '@angular/router';
import { take, map } from 'rxjs/operators';
import { Location } from '@angular/common';
import { AngularFireDatabase } from '@angular/fire/database';
import { LoadingProvider } from 'src/app/services/loading.provider';
import { DataProvider } from 'src/app/services/data.provider';
import { TranslateProvider } from 'src/app/services/translate.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
  styleUrls: ['messages.scss']
})
export class MessagesPage implements OnInit {
  public conversations: any;
  private updateDateTime: any;
  public searchFriend: any;
  // MessagesPage
  // This is the page where the user can see their current conversations with their friends.
  // The user can also start a new conversation.
  constructor(
    public translate: TranslateProvider,
    public angularDb: AngularFireDatabase,
    public loadingProvider: LoadingProvider,
    public dataProvider: DataProvider,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private location: Location) { }

  back = () => this.location.back();

  ngOnInit() {
    // Create userData on the database if it doesn't exist yet.
    this.searchFriend = '';
    // this.loadingProvider.show();

    // Get info of conversations of current logged in user.
    this.dataProvider.getConversations().snapshotChanges()
      .pipe(
        map(actions => actions.map(snapshot => {
          const data: any = snapshot.payload.val();
          return { ...data, userId: snapshot.key };
        })))
      .subscribe((conversations: any) => {
        console.log('conversations', conversations);
        if (conversations.length > 0) {
          conversations.forEach((conversation: any) => {
            if (conversation && !conversation.archived &&  !conversation.deleted) {
              // Get conversation partner info.
              console.log('listing conversation', conversation)
              this.dataProvider.getUser(conversation.userId).valueChanges().subscribe((user) => {
                conversation.friend = user;
                // Get conversation info.
                this.dataProvider.getConversation(conversation.valueChanges).valueChanges().subscribe((obj: any) => {

                  // Get last message of conversation.
                  console.log(obj);
                  let lastMessage = obj.messages[obj.messages.length - 1];
                  conversation.date = lastMessage.date;
                  conversation.sender = lastMessage.sender;
                  // Set unreadMessagesCount
                  conversation.unreadMessagesCount = obj.messages.length - conversation.messagesRead;
                  // Process last message depending on messageType.
                  if (lastMessage.type == 'text') {
                    if (lastMessage.sender == firebase.auth().currentUser.uid) {
                      conversation.message = 'You: ' + lastMessage.message;
                    } else {
                      conversation.message = lastMessage.message;
                    }
                  } else {
                    if (lastMessage.sender == firebase.auth().currentUser.uid) {
                      conversation.message = 'You sent a photo message.';
                    } else {
                      conversation.message = 'has sent you a photo message.';
                    }
                  }
                  // Add or update conversation.
                  this.addOrUpdateConversation(conversation);
                });
              });
            }
          });
          this.loadingProvider.hide();
        } else {
          this.conversations = [];
          this.loadingProvider.hide();
        }
      });

    // Update conversations' last active date time elapsed every minute based on Moment.js.
    var that = this;
    if (!that.updateDateTime) {
      that.updateDateTime = setInterval(function () {
        if (that.conversations) {
          that.conversations.forEach((conversation) => {
            let date = conversation.date;
            conversation.date = new Date(date);
          });
        }
      }, 60000);
    }  }

  async loadData(evt: any){
    this.loadConversations()

    evt.target.complete();
  }

  loadConversations(){
    this.conversations = [];

    // Create userData on the database if it doesn't exist yet.
    this.searchFriend = '';
    // this.loadingProvider.show();

    // Get info of conversations of current logged in user.
    this.dataProvider.getConversations().query.once("value",(conversations: any) => {
      conversations=  Object.entries(conversations.val());
      conversations.map(actions =>{
        const data : any =actions[1];
        return { ...data, userId:actions[0] };
      })

        console.log('conversations', conversations);
        if (conversations.length > 0) {
          conversations.forEach((conversation: any) => {
            if (conversation && !conversation.archived &&  !conversation.deleted) {
              // Get conversation partner info.
              console.log('listing conversation', conversation)
              this.dataProvider.getUser(conversation.userId).query.once("value",(user) => {
                conversation.friend = user.val();
                // Get conversation info.

                if(conversation.valueChanges){ //when refreshing we get NULLS
                  this.dataProvider.getConversation(conversation.valueChanges).query.once("value", (obj: any) => {
                    console.log(conversation.valueChanges)
                    // Get last message of conversation.
                    console.log(obj);
                    obj = obj.val()
                    // if()
                    let lastMessage = obj.messages[obj.messages.length - 1];
                    conversation.date = lastMessage.date;
                    conversation.sender = lastMessage.sender;
                    // Set unreadMessagesCount
                    conversation.unreadMessagesCount = obj.messages.length - conversation.messagesRead;
                    // Process last message depending on messageType.
                    if (lastMessage.type == 'text') {
                      if (lastMessage.sender == firebase.auth().currentUser.uid) {
                        conversation.message = 'You: ' + lastMessage.message;
                      } else {
                        conversation.message = lastMessage.message;
                      }
                    } else {
                      if (lastMessage.sender == firebase.auth().currentUser.uid) {
                        conversation.message = 'You sent a photo message.';
                      } else {
                        conversation.message = 'has sent you a photo message.';
                      }
                    }
                    // Add or update conversation.
                    this.addOrUpdateConversation(conversation);
                  });
                }

              });
            }
          });
          this.loadingProvider.hide();
        } else {
          this.conversations = [];
          this.loadingProvider.hide();
        }
      });


  }

  // Add or update conversation for real-time sync based on our observer, sort by active date.
  addOrUpdateConversation(conversation) {
    console.log('update conversation', conversation)
    if (!this.conversations) {
      this.conversations = [conversation];
    } else {
      var index = -1;
      for (var i = 0; i < this.conversations.length; i++) {
        if (this.conversations[i].valueChanges == conversation.valueChanges) {
          index = i;
        }
      }
      if (index > -1) {
        this.conversations[index] = conversation;
      } else {
        this.conversations.push(conversation);
      }
      // Sort by last active date.
      this.conversations.sort((a: any, b: any) => {
        let date1 = new Date(a.date);
        let date2 = new Date(b.date);
        if (date1 > date2) {
          return -1;
        } else if (date1 < date2) {
          return 1;
        } else {
          return 0;
        }
      });
    }
  }



  // New conversation.
  newMessage() {
    this.navCtrl.navigateForward('tabs/messages/new-message');
  }

  // Open chat with friend.
  message(userId) {
    console.log(userId)
    this.navCtrl.navigateForward('tabs/messages/message', { state: { userId } });
  }

  // Return class based if conversation has unreadMessages or not.
  hasUnreadMessages(conversation) {
    if (conversation.unreadMessagesCount > 0) {
      return 'bold';
    } else
      return '';
  }


  // deleteConversation(conversation){
  //   this.dataProvider.getConversation(conversation.valueChanges).remove()
  // }

  async deleteConversation(userId) {
    let alert = await this.alertCtrl.create({
      header: 'Are you sure you want to proceed?',
      message: 'This cannot be undone?',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Yes',
          handler: data => {
            // Proceed
            this.angularDb.object('/accounts/' + firebase.auth().currentUser.uid + '/conversations/' + userId).update({
              deleted: true,
            });
            this.loadConversations()

          }
        }
      ]
    });
    alert.present();
  }

  async archiveConversation(userId) {
    let alert = await this.alertCtrl.create({
      header: 'Are you sure you want to proceed?',
      message: 'This cannot be undone?',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Yes',
          handler: data => {
            // Proceed
            this.angularDb.object('/accounts/' + firebase.auth().currentUser.uid + '/conversations/' + userId).update({
              archived: true,
            });
            this.loadConversations()

          }
        }
      ]
    });
    alert.present();
  }
}
