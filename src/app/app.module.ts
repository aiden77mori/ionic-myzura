import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { FirebaseAuthService } from 'src/services/login.provider';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { Camera } from '@ionic-native/camera/ngx';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './shared.module';
import { LogoutProvider } from './services/logout.provider';
import { CanvasDraw } from './components/photo/canvasdraw';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Globalization } from '@ionic-native/globalization/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Mixpanel } from '@ionic-native/mixpanel/ngx';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, 
    CanvasDraw,    
     ],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(),
    AppRoutingModule, 
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FormsModule,
    SharedModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,

    
    ],
  providers: [
    StatusBar,
    SplashScreen,
    LogoutProvider,
    GooglePlus,
    Camera,
    Globalization,
    Geolocation,
    Clipboard,
    InAppBrowser,
    BarcodeScanner,
    SocialSharing,
    Mixpanel,
    FirebaseX,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
