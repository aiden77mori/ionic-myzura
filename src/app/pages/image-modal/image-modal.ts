import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'page-image-modal',
  templateUrl: 'image-modal.html',
  styleUrls: ['image-modal.scss']
})
export class ImageModalPage {
  // ImageModalPage
  // This is the page that pops up when the user tapped on an image on product view.
  // product.html.
  @Input() img: any;

  public image: any;
  constructor(private modalCtrl: ModalController) { }

  ionViewDidEnter() {
    this.image = this.img;
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
