import { Component, OnInit, Input } from '@angular/core';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { FirebaseProvider } from 'src/app/services/firebase.provider';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  @Input() postId:any = ''
  @Input() postBy:any = ''
  @Input() userId:any = ''
  @Input() modal:any
  constructor(
    private popoverController: PopoverController,
    private firebaseProvider: FirebaseProvider,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {

    console.log(this.postBy, this.userId, this.postId)
  }

  select(type) {
    this.popoverController.dismiss(type);
  } 

  async   removePost(){
    const alert = await this.alertCtrl.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this post? This cannot be undone.',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Delete',
          handler: async data => {
            console.log(this.postId)
            this.firebaseProvider.deletePostMyzura(this.postId)
            
           await  this.popoverController.dismiss();


          }
        }
      ]
    });
    alert.present();
  
}

  
}
