import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
// import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Capacitor } from '@capacitor/core';

@Pipe({ name: 'cdvphotolibrary' })
export class CDVPhotoLibraryPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer, 
    // private webView: WebView
    ) { }

  transform(url: string) {
    console.log(url);
    if (!url || (url === ''))
      return '';
    if (url.startsWith('file://') || url.startsWith('cdvphotolibrary://')) {
      url = url.replace('cdvphotolibrary://', 'file://');
      return Capacitor.convertFileSrc(url);
    } else {
      return url;
    }
    // return url.startsWith('cdvphotolibrary://') ? this.sanitizer.bypassSecurityTrustUrl(url) : url;
  }
}

