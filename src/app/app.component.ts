import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateProvider } from './services/translate.service';
import { TranslateService } from '@ngx-translate/core';
import { Globalization } from '@ionic-native/globalization/ngx';

import { environment } from 'src/environments/environment';
import { NotificationsService } from './services/notifications.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { MixpanelService } from './services/mixpanel.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  private onPauseSubscription: Subscription;

  
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateProvider,
    private translateService: TranslateService,
    private globalization: Globalization,
    private notifications: NotificationsService,
    private afAuth: AngularFireAuth,
    private mixpanelService : MixpanelService
  ) {
    this.afAuth.user.subscribe(user => {
      if (user) {
        this.notifications.notificationSetup(user.uid)
      } else {
      //   this.toast.showToast('User is not logged in');
      
      }
    });
    this.initializeApp();
  }

  initializeApp() {
    this.onPauseSubscription = this.platform.pause.subscribe(() => {
      this.mixpanelService.track("CloseApp", {
        timestamp: Date.now()
      });
    });
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();


      this.globalization.getPreferredLanguage()
      .then(res => {
      
        let lang=res.value.split("-")[0]

        localStorage.setItem("lang", lang)
        if(lang!=null && lang=="es"){
          this.translateService.setDefaultLang("es");
          this.translateService.use("es");
          this.translateService.getTranslation("es").subscribe(translations => {
            this.translate.setTranslations(translations);
          });
        }else{
          this.translateService.setDefaultLang(environment.language);
          this.translateService.use(environment.language);
          this.translateService.getTranslation(environment.language).subscribe(translations => {
          this.translate.setTranslations(translations);
          });
        }
      })
      .catch(e => {
        console.log(e)
      });
      localStorage.setItem("lang", environment.language)

      // Set language of the app.
        this.translateService.setDefaultLang(environment.language);
        this.translateService.use(environment.language);
        this.translateService.getTranslation(environment.language).subscribe(translations => {
        this.translate.setTranslations(translations);
      })
    }).catch(() => {
      localStorage.setItem("lang", environment.language)

      // Set language of the app.
      this.translateService.setDefaultLang(environment.language);
      this.translateService.use(environment.language);
      this.translateService.getTranslation(environment.language).subscribe(translations => {
        this.translate.setTranslations(translations);
      }); 
     });
  }

  ngOnDestroy() {
    // always unsubscribe your subscriptions to prevent leaks
    this.onPauseSubscription.unsubscribe();
  }
}
