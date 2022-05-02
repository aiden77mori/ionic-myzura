import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Camera } from '@ionic-native/camera/ngx';
import * as firebase from 'firebase';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ImageProvider } from 'src/app/services/image.provider';
import { DataProvider } from 'src/app/services/data.provider';
import { AlertProvider } from 'src/app/services/alert.provider';
import { AngularFireDatabase } from '@angular/fire/database';
import { LoadingProvider } from 'src/app/services/loading.provider';
import { Validator } from 'src/validator';

@Component({
  selector: 'page-new-group',
  templateUrl: 'new-group.html',
  styleUrls: ['new-group.scss']
})
export class NewGroupPage {
  public group: any;
  public groupForm: FormGroup;
  public friends: any;
  public searchFriend: any;
  public groupMembers: any;
  private alert: any;
  // NewGroupPage
  // This is the page where the user can start a new group chat with their friends.
  constructor(
    public imageProvider: ImageProvider,
    public dataProvider: DataProvider,
    public formBuilder: FormBuilder,
    public alertProvider: AlertProvider,
    public alertCtrl: AlertController,
    public angularDb: AngularFireDatabase,
    public loadingProvider: LoadingProvider,
    public camera: Camera,
    private location: Location,
    private router: Router) {
    // Create our groupForm based on Validator.ts
    this.groupForm = formBuilder.group({
      name: Validator.groupNameValidator,
      description: Validator.groupDescriptionValidator
    });
  }

  ionViewDidLoad() {
    // Initialize
    this.group = {
      img: ''
    };
    this.searchFriend = '';

    // Get user's friends to add to the group.
    this.dataProvider.getCurrentUser().subscribe((account: any) => {
      if (!this.groupMembers) {
        this.groupMembers = [account]
      }
      if (account.friends) {
        for (var i = 0; i < account.friends.length; i++) {
          this.dataProvider.getUser(account.friends[i]).snapshotChanges().subscribe((friend) => {
            this.addOrUpdateFriend(friend);
          });
        }
      } else {
        this.friends = [];
      }
    });
  }

  // Add or update friend for real-time sync.
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

  // Back
  back() {
    if (this.group)
      this.imageProvider.deleteImageFile(this.group.profilePic);
    this.location.back();
  }

  // Proceed with group creation.
  done() {
    this.loadingProvider.show();
    var messages = [];
    // Add system message that group is created.
    messages.push({
      date: new Date().toString(),
      sender: firebase.auth().currentUser.uid,
      type: 'system',
      message: 'This group has been created.',
      icon: 'chatbubbles'
    });
    // Add members of the group.
    var members = [];
    for (var i = 0; i < this.groupMembers.length; i++) {
      members.push(this.groupMembers[i].$key);
    }
    // Add group info and date.
    this.group.dateCreated = new Date().toString();
    this.group.messages = messages;
    this.group.members = members;
    this.group.name = this.groupForm.value["name"];
    this.group.description = this.groupForm.value["description"];
    // Add group to database.
    this.angularDb.list('groups').push(this.group).then((success) => {
      let groupId = success.key;
      // Add group reference to users.
      this.angularDb.object('/accounts/' + this.groupMembers[0].$key + '/groups/' + groupId).update({
        messagesRead: 1
      });
      for (var i = 1; i < this.groupMembers.length; i++) {
        this.angularDb.object('/accounts/' + this.groupMembers[i].$key + '/groups/' + groupId).update({
          messagesRead: 0
        });
      }
      // Open the group chat of the just created group.
      this.router.navigateByUrl('tabs/group', { state: { groupId } });
    });
  }

  // Add friend to members of group.
  addToGroup(friend) {
    this.groupMembers.push(friend);
  }

  // Remove friend from members of group.
  removeFromGroup(friend) {
    var index = -1;
    for (var i = 1; i < this.groupMembers.length; i++) {
      if (this.groupMembers[i].$key == friend.$key) {
        index = i;
      }
    }
    if (index > -1) {
      this.groupMembers.splice(index, 1);
    }
  }

  // Check if friend is already added to the group or not.
  inGroup(friend) {
    for (var i = 0; i < this.groupMembers.length; i++) {
      if (this.groupMembers[i].$key == friend.$key) {
        return true;
      }
    }
    return false;
  }

  // Toggle to add/remove friend from the group.
  addOrRemoveFromGroup(friend) {
    if (this.inGroup(friend)) {
      this.removeFromGroup(friend);
    } else {
      this.addToGroup(friend);
    }
  }

  // Set group photo.
  async setGroupPhoto() {
    this.alert = await this.alertCtrl.create({
      header: 'Set Group Photo',
      message: 'Do you want to take a photo or choose from your photo gallery?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Choose from Gallery',
          handler: () => {
            this.imageProvider.setGroupPhoto(this.group, this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Take Photo',
          handler: () => {
            this.imageProvider.setGroupPhoto(this.group, this.camera.PictureSourceType.CAMERA);
          }
        }
      ]
    });
    this.alert.present();
  }

  // Search people to add as friend.
  searchPeople() {
    this.router.navigateByUrl('tabs/serch-people');
  }
}
