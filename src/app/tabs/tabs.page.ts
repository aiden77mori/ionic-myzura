import { Component, ViewChild } from '@angular/core';
import { IonTabs, ModalController, NavController } from '@ionic/angular';
import { ManagePhotoPage } from '../pages/manage-photo/manage-photo';
import { QrScannerPage } from '../pages/qr-scanner/qr-scanner';
import { DataProvider } from '../services/data.provider';
import { Events } from '../services/Events';
import { Router } from '@angular/router';
import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  @ViewChild('myTabs') tabs: IonTabs;
  activeTabName: any

  user:any

  constructor(
    public dataProvider: DataProvider,
    private events: Events,
    public navCtrl: NavController,
    private router: Router,
    public keyboard: Keyboard,
    public modalCtrl: ModalController) {
      
    this.dataProvider.getCurrentUser().subscribe((user) => {
      this.user = <any>user;
      console.log('User data', user);
    });

    

  }
  getSelectedTab(): void {
    this.activeTabName = this.tabs.getSelected();
}
  async openQR() {
    let modal = await this.modalCtrl.create({
      component: QrScannerPage,
      // componentProps: { 
      //   postKey: post.postId,
      //   profilePic: this.user.profilePic ? this.user.profilePic : 'assets/profile.png',
      //   update: (comment: any) => {
      //     const { comments } = this.item;
      //     if (comments) {
      //       this.item.comments = comments + 1;
      //     } else {
      //       this.item.comments = 1;
      //     }

      //     this.item.isComment = true;
      //   }
      // }
    });
    modal.present();

    // this.navCtrl.navigateForward('/tabs/reviews/comments/'+post.postId);

  }
  async openAdd() {
    // let modal = await this.modalCtrl.create({
    //   component: ManagePhotoPage, 
    //    cssClass: "modal-fullscreen" //make modal full screen
    //   // componentProps: { 
    //   //   postKey: post.postId,
    //   //   profilePic: this.user.profilePic ? this.user.profilePic : 'assets/profile.png',
    //   //   update: (comment: any) => {
    //   //     const { comments } = this.item;
    //   //     if (comments) {
    //   //       this.item.comments = comments + 1;
    //   //     } else {
    //   //       this.item.comments = 1;
    //   //     }

    //   //     this.item.isComment = true;
    //   //   }
    //   // }
    // });
    // modal.present();
    this.navCtrl.navigateForward('tabs/crop-photo');

    // this.navCtrl.navigateForward('/tabs/reviews/comments/'+post.postId);

  }


  ScrollToTop(tab) {

    console.log(tab)
    if(this.activeTabName == tab)
    {
      this.events.publish('tabs', tab); 
    }
  }

  hideTabs(){
    // console.log('this.router.url', this.router.url);

    // console.log(this.activeTabName)
    return (this.activeTabName == 'messages' || this.activeTabName == 'comments' || this.activeTabName == 'add-outfit' || this.activeTabName == 'update-outfit' || this.router.url.includes('settings'))
  }

  isKeyboardOpen(){
    return  this.keyboard.isVisible
  }
  showAdd(){
    // console.log('this.router.url', this.router.url);
    // console.log(this.activeTabName)
    return (this.activeTabName == 'profile' && !this.router.url.includes('settings'))
  }
}
