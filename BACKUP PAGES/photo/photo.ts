import { Component, ViewChild } from '@angular/core';
import { Platform } from '@ionic/angular';
import { CameraPreview } from '@ionic-native/camera-preview/ngx';
import { TabsService } from "../../util/tabservice";
import { CanvasDraw } from "./canvasdraw";
import { StoryService } from "../../services/story.service";
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { Location } from '@angular/common';

@Component({
  selector: 'page-photo',
  templateUrl: 'photo.html',
  styleUrls: ['photo.scss']
})
export class PhotoPage {

  srcPhoto = "";

  availableColours;

  mode = 'camera';

  @ViewChild('myCanvasDraw', { static: false })
  canvas: CanvasDraw

  constructor(public location: Location, public cameraPreview: CameraPreview, public platform: Platform, public tabsService: TabsService, public storyService: StoryService, 
    private fileChooser: FileChooser
    ) {

    this.startCamera();

  }

  takePicture() {

    var self = this;

    const pictureOpts = {
      quality: 80
    }

    this.cameraPreview.takePicture(pictureOpts).then(base64PictureData => {
      //   console.log("aqui takando foto", base64PictureData)

      self.srcPhoto = base64PictureData;

      this.mode = 'photo'

      self.cameraPreview.hide().then(() => {

      })

    });
  }

  done() {
    this.mode = 'photo';
  }

  save() {


    var image = this.canvas.canvasElement.toDataURL("image/png").replace("image/png", "image/octet-stream");

    console.log(image);


    var obj = {
      id: "pavei",
      photo: "assets/profile.jpg",
      name: "Roberval",
      lastUpdated: 1492665454,
      items: [
        StoryService.buildItem("ramon-1", "photo", 3, image, image, '', false, new Date().getTime()),
      ]
    }

    //this.storyService.addFeed(obj);

    this.back();

  }

  changeColour(colour) {
  }

  ionViewWillEnter() {
    this.tabsService.hide();
  }

  ionViewWillLeave() {

    this.tabsService.show();
  }

  modeBrush() {
    this.mode = 'brush'
    this.availableColours = this.canvas.availableColours;

  }

  back() {
    try {
      // this.cameraPreview.hide().then(() =>{
      //  // this.navCtrl.setRoot(TabsPage);
      //
      //   this.cameraPreview.stopCamera().then(() =>{
      //     this.navCtrl.pop();
      //   }).catch(e =>{
      //
      //   });
      // })

      this.location.back();
    } catch (e) {

    }

  }

  startCamera() {

    try {
      this.cameraPreview.stopCamera().then(() => {

        console.log("camera started")

      }).catch(e => {
        console.log("camera error")
      });
    } catch (e) {

    }
    // start camera
    this.cameraPreview.startCamera({ x: 0, y: 0, width: this.platform.width(), height: this.platform.height(), toBack: true, previewDrag: false, tapPhoto: true });

  }

  refresh() {
    this.cameraPreview.switchCamera();
  }

  ngOnDestroy() {

  }
  videotest() {
    this.fileChooser.open()
      .then(uri => console.log(uri))
      .catch(e => console.log(e));

  }
}
