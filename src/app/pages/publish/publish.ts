import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { TabsService } from '../../util/tabservice';
import firebase from 'firebase';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { LoadingProvider } from 'src/app/services/loading.provider';
import { ImageProvider } from 'src/app/services/image.provider';
import { AngularFireDatabase } from '@angular/fire/database';
import { AlertProvider } from 'src/app/services/alert.provider';
import { FirebaseProvider } from 'src/app/services/firebase.provider';
import { ProductTagComponent } from 'src/app/components/product-tag/product-tag';
import { TagsModalComponent } from 'src/app/components/tags-modal/tags-modal';
import { TranslateProvider } from 'src/app/services/translate.service';
import { MyZuraApiService } from 'src/app/services/myzura.api.service';
import { MixpanelService } from 'src/app/services/mixpanel.service';

@Component({
  selector: 'page-publish',
  templateUrl: 'publish.html',
  styleUrls: ['publish.scss']
})
export class PublishPage implements OnInit {


  step="tag"
  location: any;
  postText: any;
  image: any;
  public myvid: any;
  public caption: string = '';
  segment = "followers";
  tabBarElement: any;
  date: any;
  testImg = "https://myzura.com/www/assets/imgs/start/1.png"

  tagModal:any
  taggedProducts:any=[]
  myPost:any
  constructor(
    public sanitizer: DomSanitizer,
    public translate: TranslateProvider,
    public loadingProvider: LoadingProvider,
    public imageProvider: ImageProvider,
    public navCtrl: NavController,
    public angularDb: AngularFireDatabase,
    private alertProvider: AlertProvider,
    private firebaseProvider: FirebaseProvider,
    private geolocation: Geolocation,
    private myzuraAPI: MyZuraApiService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private modalController: ModalController,
    private alertCtrl: AlertController,
    private mixpanelService: MixpanelService
  ) {
  }

  ngOnInit() {

    // this.myPost.onmousedown = this.GetCoordinates;


    const state: any = (window as any).history.state;
    const {image, _}= state;
    this.image = image
    this.myPost = document.getElementById("postId");

  };

  ionViewDidLeave(){
    this.image = null
  }
  async share() {
    this.loadingProvider.showLoading();
    // let loading = await this.loadingCtrl.create({
    //   spinner: 'circles'
    // });

    // loading.present();
    console.log('before location')


    this.mixpanelService.track("PublishPost", {
      source: "Publish",
      timestamp: Date.now()
    });
    //here we retrieve location
    // this.location = await this.locationShare();
    console.log('after location')

    if (this.myvid) {
      await this.angularDb.list('timeline')
        .push({
          dateCreated: new Date().toString(),
          postBy: firebase.auth().currentUser.uid,
          postText: this.postText ? this.postText : null,
          location: this.location ? this.location : null,
          video: this.myvid
        }).then((success) => {
          this.postText = '';
          let timelineId = success.key;
          this.firebaseProvider.timeline(timelineId);
          this.router.navigateByUrl('tabs/reviews', { replaceUrl: true });
          // this.alertProvider.showToast('Add post successfully!');
          // loading.dismiss();
        }).catch((error) => {
          console.log('Error', error);
        });
    } else {
      const postBy = firebase.auth().currentUser.uid;
        let finalTagged = []
        this.taggedProducts.forEach(product => {
        finalTagged.push({
            productId:product.id,
            rating: product.rating,
            tagX: product.tagX,
            tagY: product.tagY,
            tagColor: product.tagColor

          })
        });
        console.log(finalTagged)
        let userId = firebase.auth().currentUser.uid
        const res = await this.angularDb.list('timeline').push({
          dateCreated: Date.now(), // new Date().toString(),
          postBy:userId ,
          taggedProducts: JSON.stringify(finalTagged),
          postText: this.postText ? this.postText : null,
          image: "",
          photos: "",
          deleted: false,
          // username: this.,
          location: this.location ? this.location : null
        }).catch(err => {
          console.log('error while uploading post:', err);
          this.loadingProvider.hideLoading();
          // loading.dismiss();
        });
        if (res) {
          this.postText = '';
          let timelineId = res.key;

          let imgRes = await this.imageProvider.uploadPostImage(this.image.replace('octet-stream', 'jpeg'), postBy,timelineId )
          .catch(err => {console.log('error while uploading image:', err)
          });
          const imageUrl= imgRes[0]
          const fileName= imgRes[1]

          let api = await this.myzuraAPI.makePostThumbsAPI({userId: userId, postId:  timelineId, fullResURL: imageUrl,fileName :fileName})
          this.firebaseProvider.timeline(timelineId);
          console.log('OKs');


          this.taggedProducts.forEach(product => {
            this.firebaseProvider.dataProvider.getProductById(product.id).query.once("value",async  res=>{
              let p = res.val()
              let rating = p?.overallRating ?  p.overallRating: 0
              let totalRatings = p?.totalRatings ? p.totalRatings: 0
              totalRatings = totalRatings + 1
              rating = (rating + product.rating )/totalRatings
              console.log(rating, totalRatings)
              //add the post to products
             await  this.angularDb.list('products/'+product.id+'/reviews').push({
                timelineId:timelineId
              })

              await  this.angularDb.object('products/'+product.id).update({
                overallRating:rating,
                totalRatings:totalRatings
              })
            })


          });
          this.loadingProvider.hideLoading()
          this.alertProvider.showToast('Add post successfully!');
          this.router.navigateByUrl('tabs/reviews', { replaceUrl: true });

        };

    }
  }



  async shareCheck(){
    if(this.taggedProducts.length>0){
      this.share()
    }else{
      const alert = await this.alertCtrl.create({
        header: 'Confirm Publish',
        message: 'Are you sure you want to publish without tagging any product?',
        buttons: [
          {
            text: 'Cancel'
          },
          {
            text: 'Yes',
            handler: data => {
              this.share()

            }
          }
        ]
      });
      alert.present();
    }

}
  async locationShare() {
    let options: any = { timeout: 10000, enableHighAccuracy: true };
    const position: any = await this.geolocation.getCurrentPosition(options)
      .catch(err => console.log('error while getting location', err));

    let location = JSON.stringify({ lat: position.coords.latitude, long: position.coords.longitude });
    return location;
  }

  findPosition(oElement:any)
  {
    if (oElement && oElement.offsetParent)
    {
      for(var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent)
      {
        posX += oElement.offsetLeft;
        posY += oElement.offsetTop;
      }
        return [ posX, posY ];
      }
      else
      {
        return [ oElement.x, oElement.y ];
      }
  }

  async GetCoordinates(e)
  {
    var PosX = 0;
    var PosY = 0;
    var ImgPos = this.findPosition(this.myPost);
    if (!e) var e:any = window.event;
    if (e.pageX || e.pageY)
    {
      PosX = e.pageX;
      PosY = e.pageY;
    }
    else if (e.clientX || e.clientY)
      {
        PosX = e.clientX + document.body.scrollLeft
          + document.documentElement.scrollLeft;
        PosY = e.clientY + document.body.scrollTop
          + document.documentElement.scrollTop;
      }
    PosX = PosX - ImgPos[0];
    PosY = PosY - ImgPos[1];

    PosX = PosX - 15;
    PosY = PosY - 15;
    let xPercent = parseInt((PosX/ this.myPost.offsetWidth * 100).toString());
    let yPercent = parseInt((PosY /this.myPost.offsetHeight * 100).toString());
    console.log(PosX, PosY)

    const modal = await this.modalController.create({
      component: TagsModalComponent,
      // cssClass: 'tagProduct-modal',
       showBackdrop: true,
       backdropDismiss: true,
       componentProps: {
        'type': 'tag',
        'xPercent': xPercent,
        'yPercent':yPercent,
        'taggedProducts':this.taggedProducts,
      }
    });

    // modal.onDidDismiss().then((dataReturned) => {
    //   console.log(dataReturned);
    //   console.log("closed modal");
    // });


    await modal.present().then(() => {
    });
    console.log(xPercent, yPercent)
  }


  async open_product(product,i){
    // console.log(products);
    // console.log(i);


    this.tagModal= await this.modalController.create({
      component: ProductTagComponent,
      cssClass: 'tagProduct-modal',
       showBackdrop: true,
      //  enableBackdropDismiss:true,
       backdropDismiss: true,
       componentProps: {
        'product': product,
        'type':"post",
        'taggedProducts':this.taggedProducts,
        'index':i
      }
    });

    // modal.onDidDismiss().then((dataReturned) => {
    //   console.log(dataReturned);
    //   console.log("closed modal");
    // });


    await  this.tagModal.present().then(() => {
    });
  }

  async closeTagModal(){
    await this.tagModal.dismiss()
  }


  back() {
    this.navCtrl.back();
  }


  backTag(){
    document.getElementById("tagId").style.display = 'block';
    this.step="tag"
  }

  next(){
    document.getElementById("tagId").style.display = 'none';
    this.step="write"
  }

}
