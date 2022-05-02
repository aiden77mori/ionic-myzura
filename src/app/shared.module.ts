import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
// import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { FormsModule } from '@angular/forms';
import { CameraPreview } from '@ionic-native/camera-preview/ngx';
import { LoadingProvider } from './services/loading.provider';
import { CommonProvider } from './services/common.provider';
import { FeedProvider } from './services/feed.provider';
import { CDVPhotoLibraryPipe } from './pipes/cdvphotolibrary.pipe';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  declarations: [
    // CDVPhotoLibraryPipe
  ],
  providers: [
    NativeGeocoder,
    LoadingProvider,
    CommonProvider,
    FeedProvider,
    // WebView,
    Geolocation,
    Keyboard,
    // FirebaseX,
    CameraPreview,
    ImagePicker,
    PhotoLibrary
  ],
  exports: [
      // CDVPhotoLibraryPipe,
    FormsModule]
})

export class SharedModule { };