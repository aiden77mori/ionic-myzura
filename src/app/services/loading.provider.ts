import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { TranslateProvider } from './translate.service';

@Injectable()
export class LoadingProvider {
  // Loading Provider
  // This is the provider class for most of the loading spinners screens on the app.
  // Set your spinner/loading indicator type here
  // List of Spinners: https://ionicframework.com/docs/v2/api/components/spinner/Spinner/
  private spinner: any = {
    spinner: 'circles'
  };
  private loading: any;
  constructor(public loadingController: LoadingController,
    
    private translate : TranslateProvider,
    ) {
    console.log("Initializing Loading Provider");
  }

  //Show loading
  async show() {
    // if (!this.loading) {
    //   this.loading = await this.loadingController.create(this.spinner);
    //   if(this.loading){
    //     this.loading.present();
    //   }
    // }
  }

  //Hide loading
  async hide() {        
    // try {
    //   // const t = await this.loadingController.getTop();
    //   // console.log('loading handler',t);
    //   // if(this.loading){
    //   //  await this.loading.dismiss();
    //   // }
    //   await this.loading.dismiss();

    // } catch (err) {
    //   console.log('Loading Provider Error:', err);
    // }    
  }

    //Show loading
    async showLoading() {
      this.loading = await this.loadingController.create({
        message: this.translate.get('alert.loading.text'),
      });
      await  this.loading.present();
    }
  
    //Hide loading
    async hideLoading() {        
      try {
        await this.loading.dismiss();
  
      } catch (err) {
        console.log('Loading Provider Error:', err);
      }    
    }
}
