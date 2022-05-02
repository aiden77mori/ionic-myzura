import { Component, ViewChild } from '@angular/core';
import { AlertController, ModalController, IonContent, NavController } from '@ionic/angular';

import firebase from 'firebase';
import { Camera } from '@ionic-native/camera/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { take } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ImageModalPage } from '../image-modal/image-modal';
import { DataProvider } from 'src/app/services/data.provider';
import { AngularFireDatabase } from '@angular/fire/database';
import { LoadingProvider } from 'src/app/services/loading.provider';
import { ImageProvider } from 'src/app/services/image.provider';
import { TranslateProvider } from 'src/app/services/translate.service';
import { FirebaseProvider } from 'src/app/services/firebase.provider';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
  styleUrls: ['message.scss']
})
export class MessagePage {
  @ViewChild(IonContent, { static: false }) content: IonContent;
  public userId: any;
  title: any;
  public user: any;
  public message: any;
  public valueChanges: any;
  public messages: any;
  public alert: any;
  public updateDateTime: any;
  public messagesToShow: any;
  public startIndex: any = -1;
  public scrollDirection: any = 'bottom';
  // Set number of messages to show.
  public numberOfMessages = 10;

  // MessagePage
  // This is the page where the user can chat with a friend.
  constructor(
    public dataProvider: DataProvider,
    public angularDb: AngularFireDatabase,
    public loadingProvider: LoadingProvider,
    public translate: TranslateProvider,
    public alertCtrl: AlertController,
    public imageProvider: ImageProvider,
    public modalCtrl: ModalController,
    public camera: Camera,
    public firebaseProvider: FirebaseProvider,
    private notifications : NotificationsService,
    private location: Location,
    private navCtrl: NavController,
    private router: Router,
    public keyboard: Keyboard) { }

  ionViewDidEnter() {
    const { userId } = (window as any).history.state;

    this.userId = userId;

    // Get friend details.
    this.dataProvider.getUser(this.userId).valueChanges().pipe(take(1)).subscribe((user: any) => {
      this.title = user.name;
    });
    this.dataProvider.getUser(firebase.auth().currentUser.uid).valueChanges().pipe(take(1)).subscribe((user: any) => {
      this.user = user;
    });
    // Get conversationInfo with friend.
    this.angularDb.object('/accounts/' + firebase.auth().currentUser.uid + '/conversations/' + this.userId).valueChanges().pipe(take(1)).subscribe((conversation: any) => {
      if (conversation) {
        // User already have conversation with this friend, get conversation
        console.log('getting conversation',conversation)
        this.valueChanges = conversation.valueChanges;

        // Get conversation
        this.dataProvider.getConversationMessages(this.valueChanges).subscribe((messages: any) => {
          if (this.messages) {
            // Just append newly added messages to the bottom of the view.
            if (messages.length > this.messages.length) {
              let message = messages[messages.length - 1];
              this.dataProvider.getUser(message.sender).valueChanges().pipe(take(1)).subscribe((user: any) => {
                message.avatar = user.photos? user.photos["128"] : user.profilePic;
              });
              this.messages.push(message);
              // Also append to messagesToShow.
              this.messagesToShow.push(message);
              // Reset scrollDirection to bottom.
              this.scrollDirection = 'bottom';
            }
          } else {
            // Get all messages, this will be used as reference object for messagesToShow.
            this.messages = [];
            messages.forEach((message) => {
              this.dataProvider.getUser(message.sender).valueChanges().pipe(take(1)).subscribe((user: any) => {
                message.avatar = user.photos? user.photos["128"] : user.profilePic;
              });
              this.messages.push(message);
            });
            // Load messages in relation to numOfMessages.
            if (this.startIndex == -1) {
              // Get initial index for numberOfMessages to show.
              if ((this.messages.length - this.numberOfMessages) > 0) {
                this.startIndex = this.messages.length - this.numberOfMessages;
              } else {
                this.startIndex = 0;
              }
            }
            if (!this.messagesToShow) {
              this.messagesToShow = [];
            }
            // Set messagesToShow
            for (var i = this.startIndex; i < this.messages.length; i++) {
              this.messagesToShow.push(this.messages[i]);
            }
            this.loadingProvider.hide();
          }
        });
      }
    });

    // Update messages' date time elapsed every minute based on Moment.js.
    var that = this;
    if (!that.updateDateTime) {
      that.updateDateTime = setInterval(function () {
        if (that.messages) {
          that.messages.forEach((message) => {
            let date = message.date;
            message.date = new Date(date);
          });
        }
      }, 60000);
    }
  }

  // Load previous messages in relation to numberOfMessages.
  loadPreviousMessages() {
    var that = this;
    // Show loading.
    this.loadingProvider.show();
    setTimeout(function () {
      // Set startIndex to load more messages.
      if ((that.startIndex - that.numberOfMessages) > -1) {
        that.startIndex -= that.numberOfMessages;
      } else {
        that.startIndex = 0;
      }
      // Refresh our messages list.
      that.messages = null;
      that.messagesToShow = null;
      // Set scroll direction to top.
      that.scrollDirection = 'top';
      // Populate list again.
      that.ionViewDidEnter();
    }, 1000);
  }

  // Update messagesRead when user lefts this page.
  ionViewWillLeave() {
    if (this.messages)
      this.setMessagesRead(this.messages);
  }

  // Check if currentPage is active, then update user's messagesRead.
  setMessagesRead(messages) {
    // if (this.navCtrl.getActive().instance instanceof MessagePage) {
    // Update user's messagesRead on database.
    var totalMessagesCount;
    this.dataProvider.getConversationMessages(this.valueChanges).subscribe((messages: any) => {
      totalMessagesCount = messages.length;
      this.angularDb.object('/accounts/' + firebase.auth().currentUser.uid + '/conversations/' + this.userId).update({
        messagesRead: totalMessagesCount
      });
    });

    // }
  }

  // Check if 'return' button is pressed and send the message.
  onType(keyCode) {
    if (keyCode == 13) {
      this.keyboard.hide();
      this.send();
    }
  }

  // Scroll to bottom of page after a short delay.
  scrollBottom() {
    var that = this;
    setTimeout(function () {
      that.content.scrollToBottom();
    }, 300);
  }

  // Scroll to top of the page after a short delay.
  scrollTop() {
    var that = this;
    setTimeout(function () {
      that.content.scrollToTop();
    }, 300);
  }

  // Scroll depending on the direction.
  doScroll() {
    if (this.scrollDirection == 'bottom') {
      this.scrollBottom();
    } else if (this.scrollDirection == 'top') {
      this.scrollTop();
    }
  }

  // Check if the user is the sender of the message.
  isSender(message) {
    if (message.sender == firebase.auth().currentUser.uid) {
      return true;
    } else {
      return false;
    }
  }

  // Back
  back() {
    this.location.back();
  }

  // Send message, if there's no conversation yet, create a new conversation.
  send() {
    if (this.message && this.message.length > 0) {
      // User entered a text on messagebox
      if (this.valueChanges) {
        // Add Message to the existing conversation
        // Clone an instance of messages object so it will not directly be updated.
        // The messages object should be updated by our observer declared on ionViewDidLoad.
        let messages = JSON.parse(JSON.stringify(this.messages));
        messages.push({
          date: new Date().toString(),
          sender: firebase.auth().currentUser.uid,
          type: 'text',
          message: this.message
        });
        // Update conversation on database.
        this.dataProvider.getConversation(this.valueChanges).update({
          messages: messages
        });
        // Clear messagebox.
        this.message = '';
        // this.navCtrl.navigateBack("/tabs/messages")
      } else {
        // New Conversation with friend.
        var messages = [];
        messages.push({
          date: new Date().toString(),
          sender: firebase.auth().currentUser.uid,
          type: 'text',
          message: this.message
        });
        var users = [];
        users.push(firebase.auth().currentUser.uid);
        users.push(this.userId);
        // Add conversation.
        this.angularDb.list('conversations').push({
          dateCreated: new Date().toString(),
          messages: messages,
          users: users
        }).then((success) => {
          let valueChanges = success.key;
          this.message = '';
          // Add conversation reference to the users.
          this.angularDb.object('/accounts/' + firebase.auth().currentUser.uid + '/conversations/' + this.userId).update({
            valueChanges: valueChanges,
            messagesRead: 1,
            deleted: false,
            archived: false
          });
          this.angularDb.object('/accounts/' + this.userId + '/conversations/' + firebase.auth().currentUser.uid).update({
            valueChanges: valueChanges,
            messagesRead: 0,
            deleted: false,
            archived: false
          });

          // this.navCtrl.navigateBack("/tabs/messages")

        });
      }
      console.log(this.user, this.message)
      this.notifications.sendNotification({
        userId: this.userId ,
        type: "message",
        username: this.user.username,
        action: this.translate.get('notifications.sent'),
        body:  this.translate.get('notifications.youamessage'),
        senderId: this.user.userId,
        postId:this.userId //receiver
      })
    }

    this.loadPreviousMessages()
  }

  // View user info
  // View user.
  viewUser(userId) {
    console.log(userId);
    if(userId == this.firebaseProvider.getCurrentUserId()){
      this.navCtrl.navigateForward('tabs/profile');
    }else{
      this.navCtrl.navigateForward('tabs/user-info/'+userId);
    }
  }

  // Send photoMessage.
  async sendPhoto() {
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
            // Upload image then return the url.
            this.imageProvider.uploadPhotoMessage(this.valueChanges, this.camera.PictureSourceType.PHOTOLIBRARY).then((url) => {
              // Process image message.
              this.sendPhotoMessage(url);
            });
          }
        },
        {
          text: 'Take Photo',
          handler: () => {
            // Upload image then return the url.
            this.imageProvider.uploadPhotoMessage(this.valueChanges, this.camera.PictureSourceType.CAMERA).then((url) => {
              // Process image message.
              this.sendPhotoMessage(url);
            });
          }
        }
      ]
    });
    this.alert.present();
  }

  // Process photoMessage on database.
  sendPhotoMessage(url) {
    if (this.valueChanges) {
      // Add image message to existing conversation.
      let messages = JSON.parse(JSON.stringify(this.messages));
      messages.push({
        date: new Date().toString(),
        sender: firebase.auth().currentUser.uid,
        type: 'image',
        url: url
      });
      // Update conversation on database.
      this.dataProvider.getConversation(this.valueChanges).update({
        messages: messages
      });
    } else {
      // Create new conversation.
      var messages = [];
      messages.push({
        date: new Date().toString(),
        sender: firebase.auth().currentUser.uid,
        type: 'image',
        url: url
      });
      var users = [];
      users.push(firebase.auth().currentUser.uid);
      users.push(this.userId);
      // Add conversation.
      this.angularDb.list('conversations').push({
        dateCreated: new Date().toString(),
        messages: messages,
        users: users
      }).then((success) => {
        let valueChanges = success.key;
        // Add conversation references to users.
        this.angularDb.object('/accounts/' + firebase.auth().currentUser.uid + '/conversations/' + this.userId).update({
          valueChanges: valueChanges,
          messagesRead: 1,
          deleted: false,
          archived: false
        });
        this.angularDb.object('/accounts/' + this.userId + '/conversations/' + firebase.auth().currentUser.uid).update({
          valueChanges: valueChanges,
          messagesRead: 0,
          deleted: false,
          archived: false
        });
      });
    }
  }

  // Enlarge image messages.
  async enlargeImage(img) {
    let imageModal = await this.modalCtrl.create({
      component: ImageModalPage,
      componentProps: { img: img }
    } );
    imageModal.present();
  }
}
