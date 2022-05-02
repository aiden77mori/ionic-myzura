import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { DataProvider } from 'src/app/services/data.provider';
import { ClosetComponent } from '../closet/closet';
 

/**
 * This page show us user's friends posts 
 * and following users posts
 *
 */

@Component({
  selector: 'app-closet-cat',
  templateUrl: 'closet-cat.html',
  styleUrls: ['closet-cat.scss']
})
export class ClosetCatComponent {

  @Input() closetList:any;
  @Input() categories:any;
  @Input() visitor:boolean;

  constructor(
    public modalCtrl: ModalController,
    public dataProvider: DataProvider,
    public navCtrl: NavController
    // public storyService: StoryService
    ) {

    
  }

 
  
  async openCloset(products){
    const modal = await this.modalCtrl.create({
      component: ClosetComponent,
      // cssClass: 'tagProduct-modal',
       showBackdrop: true,
       backdropDismiss: true,
       componentProps: {
        'closetData':products,
        'visitor':this.visitor,
      }
    });

    await modal.present().then(() => {
    });
  }
  openProducts(){
    this.navCtrl.navigateForward('tabs/publish/marketplace');
  }

}
