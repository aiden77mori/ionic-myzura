import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { DataProvider } from 'src/app/services/data.provider';
 

/**
 * This page show us user's friends posts 
 * and following users posts
 *
 */

@Component({
  selector: 'page-closet',
  templateUrl: 'closet.html',
  styleUrls: ['closet.scss']
})
export class ClosetComponent {

  @Input() closetData:any;
  @Input() visitor:boolean;

  constructor(
    public modalCtrl: ModalController,
    public dataProvider: DataProvider,
    public navCtrl: NavController
    // public storyService: StoryService
    ) {

    
  }

 
  
 async  back() {
   await  this.modalCtrl.dismiss();
  }
  openProducts(){
    this.navCtrl.navigateForward('tabs/publish/marketplace');
  }

}
