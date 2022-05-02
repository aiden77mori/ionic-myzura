import { Component, ElementRef, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import * as firebase from 'firebase';

// import {
//   GoogleMaps,
//   GoogleMap,
//   LatLng,
//   CameraPosition,
//   MarkerOptions,
//   Marker,
//   GoogleMapsEvent
// } from '@ionic-native/google-maps/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { Location } from '@angular/common';
import { LoadingProvider } from 'src/app/services/loading.provider';
import { DataProvider } from 'src/app/services/data.provider';
import { AngularFireDatabase } from '@angular/fire/database';
import { FirebaseProvider } from 'src/app/services/firebase.provider';
import { ImageProvider } from 'src/app/services/image.provider';
import { AlertProvider } from 'src/app/services/alert.provider';


// declare var google: any;

@Component({
  selector: 'page-add-post',
  templateUrl: 'add-post.html',
  styleUrls: ['add-post.scss']
})
export class AddPostPage {
  public user: any;
  public postText;
  public alert;
  public image: any;
  public location: string;
  @ViewChild('map', {static: false}) mapElement: ElementRef;
  map: any;

  constructor(    
    public loadingProvider: LoadingProvider,
    public dataProvider: DataProvider,
    public angularDb: AngularFireDatabase,
    public firebaseProvider: FirebaseProvider,
    public alertCtrl: AlertController,
    public imageProvider: ImageProvider,
    public alertProvider: AlertProvider,    
    private geolocation: Geolocation, 
    private fileChooser: FileChooser,
    private locationCtrl: Location) {
  }

  ionViewDidEnter() {
    // Observe the userData on database to be used by our markup html.
    // Whenever the userData on the database is updated, it will automatically reflect on our user variable.
    this.dataProvider.getCurrentUser().subscribe((user) => {
      this.loadingProvider.hide();
      this.user = user;
    });
  }

  post() {
    if (this.image) {
      this.loadingProvider.show();
      this.locationShare(() => {
        // this.imageProvider.uploadPostImage(this.image).then((url) => {
        //   // ======= push new post in 'timeline' ====
        //   this.angularDb.list('timeline').push({
        //     dateCreated: new Date().toString(),
        //     postBy: firebase.auth().currentUser.uid,
        //     postText: this.postText,
        //     image: url,
        //     location: this.location
        //   }).then((success) => {
        //     this.postText = '';
        //     let timelineId = success.key;
        //     this.firebaseProvider.timeline(timelineId);
        //     this.alertProvider.showToast('Add post successfully ..');
        //     this.loadingProvider.hide();
        //     this.locationCtrl.back();
        //   })
        // })
      })
    }
    // else if (this.location) {
    //     this.loadingProvider.show();
    //     // ======= push new post in 'timeline' ====
    //     this.angularDb.list('timeline').push({
    //         dateCreated: new Date().toString(),
    //         postBy: firebase.auth().currentUser.uid,
    //         postText: this.postText,
    //         location: this.location
    //     }).then((success) => {
    //         this.postText = '';
    //         let timelineId = success.key;
    //         this.firebaseProvider.timeline(timelineId);
    //         this.alertProvider.showToast('Add post successfully ..');
    //         this.loadingProvider.hide();
    //         this.navCtrl.pop();
    //
    //     })
    // }
    else {
      this.loadingProvider.show();
      // ======= push new post in 'timeline' ====
      this.locationShare(() => {
        this.angularDb.list('timeline').push({
          dateCreated: new Date().toString(),
          postBy: firebase.auth().currentUser.uid,
          postText: this.postText,
          location: this.location
        }).then((success) => {
          this.postText = '';
          let timelineId = success.key;
          this.firebaseProvider.timeline(timelineId);
          this.alertProvider.showToast('Add post successfully ..')
          this.loadingProvider.hide();
          this.locationCtrl.back();
        })
      })
    }
  }

  imageShare() {
    this.imageProvider.setImage().then((url) => {
      console.log("url", url);
      this.image = url;
    })
  }

  locationShare(success) {
    // this.loadingProvider.show();
    var options = { timeout: 10000, enableHighAccuracy: true };

    this.geolocation.getCurrentPosition(options).then((position) => {
      this.location = JSON.stringify({ lat: position.coords.latitude, long: position.coords.longitude })
      //  this.loadingProvider.hide();
      success();
    }, (err) => {
      this.loadingProvider.hide();
      console.log(err);
    });
  }

  // locationShare() {
  //     // var geocoder = new google.maps.Geocoder;
  //     // geocoder.reverseGeocode(30.7046, 76.7179).then((res) => {
  //
  //     // });
  //     this.location = "Mohali";
  //
  //     this.loadingProvider.show();
  //
  //
  //
  //     var options = {timeout: 10000, enableHighAccuracy: true};
  //     this.geolocation.getCurrentPosition(options).then((position) => {
  //        // let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  //         this.nativeGeocoder.reverseGeocode(30.7046, 76.7179)
  //             .then((result:NativeGeocoderReverseResult)
  //                 =>{ console.log(JSON.stringify(result)))
  //             .catch((error:any) => console.log(error));
  //
  //         // let mapOptions = {
  //         //     center: latLng,
  //         //     zoom: 15,
  //         //     mapTypeId: google.maps.MapTypeId.ROADMAP
  //         // }
  //         this.location = JSON.stringify({lat: position.coords.latitude, long: position.coords.longitude})
  //         // this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  //         // let marker = new google.maps.Marker({
  //         //     map: this.map,
  //         //     animation: google.maps.Animation.DROP,
  //         //     position: this.map.getCenter()
  //         // });
  //         this.loadingProvider.hide();
  //     }, (err) => {
  //         console.log(err);
  //     });
  //     // const watch = geolocation.watchPosition().subscribe(pos => {
  //     //   console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
  //     // });
  // }

  videotest() {
    this.fileChooser.open()
      .then(uri => console.log(uri))
      .catch(e => console.log(e));
  }
}
