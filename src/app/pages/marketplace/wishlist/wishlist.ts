import { Component, Input } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { FirebaseProvider } from '../../../services/firebase.provider';
import { DataProvider } from '../../../services/data.provider';
import { TranslateProvider } from '../../../services/translate.service';
import { Observable } from 'rxjs';
import { WhishlistProvider } from 'src/app/services/providers/wishlist.provider';
import { take } from 'rxjs/operators';

@Component({
  selector: 'page-wishlist',
  templateUrl: 'wishlist.html',
  styleUrls: ['wishlist.scss']
})
export class WishlistPage {
  products$: Observable<any[]>;

  constructor(
    public firebaseProvider: FirebaseProvider,
    public dataProvider: DataProvider,
    public translate: TranslateProvider,
    public navCtrl: NavController,
    public whishlistProvider: WhishlistProvider,
    public modalCtrl: ModalController) {

  }

  ionViewWillEnter() {
    this.products$ = this.whishlistProvider.whishlist$
    this.whishlistProvider.nextPage()
    .pipe(take(1))
    .subscribe();
  }


  
  ionViewDidLeave() {
    this.whishlistProvider.destroy();  
  }
  ngOnDestroy() {
    this.whishlistProvider.destroy();  
  }

  back() {
    this.modalCtrl.dismiss();
  }
  doInfinite(infiniteScrollEvent): Promise<void> {
    console.log("infiniteScrollEvent")
    console.log(infiniteScrollEvent)
    return new Promise((resolve, reject) => {

      this.whishlistProvider.nextPage()
        .pipe(take(1))
        .subscribe(products => {
          console.log('Products!', products);
          infiniteScrollEvent.target.complete();

          // this.products$ = this.productsProvider.products$;


          resolve();
        });

    });
   }

}
