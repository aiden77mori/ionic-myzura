import { Injectable } from '@angular/core';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';

@Injectable({ providedIn: 'root' })
export class CommonProvider {
  constructor(
    private nativeGeocoder: NativeGeocoder,
  ) {

  }

  locationAddress(location, success) {
    // this.nativeGeocoder.reverseGeocode(location.lat, location.long)
    //   .then((result: any) => {
    //     console.log('ReverseGeoCode', JSON.stringify(result));
    //     success(result);
    //   }).catch((error: any) => console.log('GeocodeError', error));
  }
}