import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, MenuController } from '@ionic/angular';
import { DataProvider } from '../services/data.provider';

// import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.page.html',
  styleUrls: ['./loader.page.scss'],
})
export class LoaderPage implements OnInit {

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public dataProvider: DataProvider,
    public loadingController: LoadingController
  ) { }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: '',
      duration: 1000
    });

    await loading.present();

    console.log('LOADER')

    this.navCtrl.navigateRoot('tabs/reviews');

    if (this.dataProvider.getLoggedInUser() != null) {
      this.navCtrl.navigateRoot('tabs/reviews');

    } else {
      this.navCtrl.navigateRoot('sign-in');

      return false;
    }
    // this.storage.get('introShown').then((introShown: boolean) => {
    //   loading.onWillDismiss().then(() => {
    //     if (introShown) {
    //       this.navCtrl.navigateRoot('tabs/home');
    //     } else {
    //       this.navCtrl.navigateRoot('walkthrough');
    //     }
    //   });
    // }).catch((e) => {});
  }

}
