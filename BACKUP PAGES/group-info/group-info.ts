import { Component } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';

import { ImageModalPage } from '../image-modal/image-modal';
import { AddMembersPage } from '../add-members/add-members';
import { UserInfoPage } from '../user-info/user-info';
import * as firebase from 'firebase';
import { Camera } from '@ionic-native/camera/ngx';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DataProvider } from 'src/app/services/data.provider';
import { LoadingProvider } from 'src/app/services/loading.provider';
import { AlertProvider } from 'src/app/services/alert.provider';
import { AngularFireDatabase } from '@angular/fire/database';
import { ImageProvider } from 'src/app/services/image.provider';

@Component({
  selector: 'page-group-info',
  templateUrl: 'group-info.html',
  styleUrls: ['group-info.scss']
})
export class GroupInfoPage {
  private groupId: any;
  public group: any;
  public groupMembers: any;
  private alert: any;
  private user: any;
  private subscription: any;
  // GroupInfoPage
  // This is the page where the user can view group information, change group information, add members, and leave/delete group.
  constructor(
    public dataProvider: DataProvider,
    public loadingProvider: LoadingProvider,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public alertProvider: AlertProvider,
    public angularDb: AngularFireDatabase,
    public imageProvider: ImageProvider,
    public camera: Camera,
    private router: Router,
    private location: Location) { }

  ionViewDidEnter() {
    // Initialize
    const { groupId } = (window as any).history.state;
    this.groupId = groupId;

    // Get group details.
    this.subscription = this.dataProvider.getGroup(this.groupId).snapshotChanges().subscribe((group: any) => {
      if (group.$exists()) {
        this.loadingProvider.show();
        this.group = group;
        if (group.members) {
          group.members.forEach((memberId) => {
            this.dataProvider.getUser(memberId).snapshotChanges().subscribe((member) => {
              this.addUpdateOrRemoveMember(member);
            });
          });
        }
        this.loadingProvider.hide();
      } else {
        // Group is deleted, go back.
        this.router.navigateByUrl('tabs/reviews', { replaceUrl: true });
      }
    });

    // Get user details.
    this.dataProvider.getCurrentUser().subscribe((user) => {
      this.user = user;
    });
  }

  // Delete subscription.
  // ionViewDidLeave() {
  //   if(this.deleteSubscription)
  //
  // }

  // Check if user exists in the group then add/update user.
  // If the user has already left the group, remove user from the list.
  addUpdateOrRemoveMember(member) {
    if (this.group) {
      if (this.group.members.indexOf(member.$key) > -1) {
        // User exists in the group.
        if (!this.groupMembers) {
          this.groupMembers = [member];
        } else {
          var index = -1;
          for (var i = 0; i < this.groupMembers.length; i++) {
            if (this.groupMembers[i].$key == member.$key) {
              index = i;
            }
          }
          // Add/Update User.
          if (index > -1) {
            this.groupMembers[index] = member;
          } else {
            this.groupMembers.push(member);
          }
        }
      } else {
        // User already left the group, remove member from list.
        var index = -1;
        for (var i = 0; i < this.groupMembers.length; i++) {
          if (this.groupMembers[i].$key == member.$key) {
            index = i;
          }
        }
        if (index > -1) {
          this.groupMembers.splice(index, 1);
        }
      }
    }
  }

  // View user info.
  viewUser(userId) {
    if (firebase.auth().currentUser.uid != userId)
      this.router.navigateByUrl('tabs/user-info', { state: { userId } });
  }

  // Back
  back() {
    this.subscription.unsubscribe();
    this.location.back();
  }

  // Enlarge group image.
  async enlargeImage(img) {
    let imageModal = await this.modalCtrl.create({
      component: ImageModalPage,
      componentProps: { img: img }
    });
    imageModal.present();
  }

  // Change group name.
  async setName() {
    this.alert = await this.alertCtrl.create({
      header: 'Change Group Name',
      message: "Please enter a new group name.",
      inputs: [
        {
          name: 'name',
          placeholder: 'Group Name',
          value: this.group.name
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
            if (this.group.name != name) {
              this.loadingProvider.show();
              // Add system message.
              this.group.messages.push({
                date: new Date().toString(),
                sender: this.user.$key,
                type: 'system',
                message: this.user.name + ' has changed the group name to: ' + name + '.',
                icon: 'md-create'
              });
              // Update group on database.
              this.dataProvider.getGroup(this.groupId).update({
                name: name,
                messages: this.group.messages
              }).then((success) => {
                this.loadingProvider.hide();
                this.alertProvider.showGroupUpdatedMessage();
              }).catch((error) => {
                this.loadingProvider.hide();
                this.alertProvider.showErrorMessage('group/error-update-group');
              });
            }
          }
        }
      ]
    });
    this.alert.present();
  }

  // Change group image, the user is asked if they want to take a photo or choose from gallery.
  async setPhoto() {
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
            this.loadingProvider.show();
            // Upload photo and set to group photo, afterwards, return the group object as promise.
            this.imageProvider.setGroupPhotoPromise(this.group, this.camera.PictureSourceType.PHOTOLIBRARY).then((group) => {
              // Add system message.
              this.group.messages.push({
                date: new Date().toString(),
                sender: this.user.$key,
                type: 'system',
                message: this.user.name + ' has changed the group photo.',
                icon: 'camera'
              });
              // Update group image on database.
              this.dataProvider.getGroup(this.groupId).update({
                img: group.profilePic,
                messages: this.group.messages
              }).then((success) => {
                this.loadingProvider.hide();
                this.alertProvider.showGroupUpdatedMessage();
              }).catch((error) => {
                this.loadingProvider.hide();
                this.alertProvider.showErrorMessage('group/error-update-group');
              });
            });
          }
        },
        {
          text: 'Take Photo',
          handler: () => {
            this.loadingProvider.show();
            // Upload photo and set to group photo, afterwwards, return the group object as promise.
            this.imageProvider.setGroupPhotoPromise(this.group, this.camera.PictureSourceType.CAMERA).then((group) => {
              // Add system message.
              this.group.messages.push({
                date: new Date().toString(),
                sender: this.user.$key,
                type: 'system',
                message: this.user.name + ' has changed the group photo.',
                icon: 'camera'
              });
              // Update group image on database.
              this.dataProvider.getGroup(this.groupId).update({
                img: group.profilePic,
                messages: this.group.messages
              }).then((success) => {
                this.loadingProvider.hide();
                this.alertProvider.showGroupUpdatedMessage();
              }).catch((error) => {
                this.loadingProvider.hide();
                this.alertProvider.showErrorMessage('group/error-update-group');
              });
            });
          }
        }
      ]
    });
    this.alert.present();
  }

  // Change group description.
  async setDescription() {
    this.alert = await this.alertCtrl.create({
      header: 'Change Group Description',
      message: "Please enter a new group description.",
      inputs: [
        {
          name: 'description',
          placeholder: 'Group Description',
          value: this.group.description
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
            if (this.group.description != description) {
              this.loadingProvider.show();
              // Add system message.
              this.group.messages.push({
                date: new Date().toString(),
                sender: this.user.$key,
                type: 'system',
                message: this.user.name + ' has changed the group description.',
                icon: 'clipboard'
              });
              // Update group on database.
              this.dataProvider.getGroup(this.groupId).update({
                description: description,
                messages: this.group.messages
              }).then((success) => {
                this.loadingProvider.hide();
                this.alertProvider.showGroupUpdatedMessage();
              }).catch((error) => {
                this.loadingProvider.hide();
                this.alertProvider.showErrorMessage('group/error-update-group');
              });
            }
          }
        }
      ]
    });
    this.alert.present();
  }

  // Leave group.
  async leaveGroup() {
    this.alert = await this.alertCtrl.create({
      header: 'Confirm Leave',
      message: 'Are you sure you want to leave this group?',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Leave',
          handler: data => {
            this.loadingProvider.show();
            // Remove member from group.
            this.group.members.splice(this.group.members.indexOf(this.user.$key), 1);
            // Add system message.
            this.group.messages.push({
              date: new Date().toString(),
              sender: this.user.$key,
              type: 'system',
              message: this.user.name + ' has left this group.',
              icon: 'log-out'
            });
            // Update group on database.
            this.dataProvider.getGroup(this.groupId).update({
              members: this.group.members,
              messages: this.group.messages
            }).then((success) => {
              // Remove group from user's group list.
              this.angularDb.object('/accounts/' + firebase.auth().currentUser.uid + '/groups/' + this.groupId).remove().then(() => {
                // Pop this view because user already has left this group.
                this.group = null;
                setTimeout(() => {
                  this.loadingProvider.hide();
                  this.router.navigateByUrl('tabs/reviews', { replaceUrl: true });
                }, 300);
              });
            }).catch((error) => {
              this.alertProvider.showErrorMessage('group/error-leave-group');
            });
          }
        }
      ]
    });
    this.alert.present();
  }

  // Delete group.
  async deleteGroup() {
    this.alert = await this.alertCtrl.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this group?',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Delete',
          handler: data => {
            let group = JSON.parse(JSON.stringify(this.group));
            // Delete all images of image messages.
            group.messages.forEach((message) => {
              if (message.type == 'image') {
                console.log("Delete: " + message.url + " of " + group.$key);
                this.imageProvider.deleteGroupImageFile(group.$key, message.url);
              }
            });
            // Delete group image.
            console.log("Delete: " + group.profilePic);
            this.imageProvider.deleteImageFile(group.profilePic);
            this.angularDb.object('/accounts/' + firebase.auth().currentUser.uid + '/groups/' + group.$key).remove().then(() => {
              this.dataProvider.getGroup(group.$key).remove();
            });
          }
        }
      ]
    });
    this.alert.present();
  }

  // Add members.
  addMembers() {
    this.router.navigateByUrl('tabs/groups/add-menber', { state: { groupId: this.groupId } });
  }
}
