import { Component, OnInit, Input } from '@angular/core';
import { ImageModalPage } from 'src/app/pages/image-modal/image-modal';
import { CommentsPage } from 'src/app/pages/comments/comments';
import { FirebaseProvider } from 'src/app/services/firebase.provider';
import { Router } from '@angular/router';
import { ModalController, PopoverController, NavController, NavParams } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';
import { ProductTagComponent } from '../product-tag/product-tag';
import { map, take } from 'rxjs/operators';
import { MixpanelService } from 'src/app/services/mixpanel.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { TranslateProvider } from 'src/app/services/translate.service';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
})
export class PostCardComponent implements OnInit {

  @Input() item: any;
  @Input() user: any;
  public muted: string = 'muted';
  showTagsVar=''
  doubleTapped=false
  touchtime= 0
  constructor(
    private firebaseProvider: FirebaseProvider,
    private router: Router,
    private mixpanelService: MixpanelService,
    private navCtrl: NavController,
    public popoverController: PopoverController,
    private modalCtrl: ModalController,
    private notifications: NotificationsService,
    public translate: TranslateProvider
  ) {
   }

  ngOnInit() { 


    // this.mixpanelService.setUserId(this.user.uid)

    try {
      this.item.taggedProducts = JSON.parse(this.item.taggedProducts)
    } catch (e) {
        // return false;
    }

 
  }

  mute(){
    if (this.muted === 'muted'){
      this.muted = '';
    } else {
      this.muted = 'muted';
    }
  }


  searchByHashTag(val) {
    console.log('go search');

    this.router.navigateByUrl('tabs/marketplace', { state: { hashtag: val, hash: true } });
  }

  likePost(post) {
    const { likes } = this.item;
    if (likes) {
      this.item.likes = likes + 1;
    } else {
      this.item.likes = 1;
    }
    this.item.isLike = true;
    this.firebaseProvider.likePost(post.postId)
    // date: Date.now(),
    // type: params.type,
    // username: params.username,
    // title: params.title,
    // body: params.body,
    // senderId: params.sender
    console.log(this.item, this.user)
    this.notifications.sendNotification({
      userId: post.postBy,
      type: "Like",
      username: this.user.username,
      action: this.translate.get('notifications.liked'),
      body:  this.translate.get('notifications.yourpost'),
      senderId: this.user.userId,
      postId: post.postId

    })
    this.mixpanelService.track("LikePost", {
      post: post.postId,
      timestamp: Date.now()
    })
  }

  bookmarkPost(post) {
    console.log(post);
    this.firebaseProvider.bookmarkPost(post.postId);
    this.mixpanelService.track("SavePost", {
      post: post.postId,
      timestamp: Date.now()
    })
  }

  isFavorite(post) {
    const { bookmark } = this.user;

    if (!bookmark)
      return false;

    if (bookmark.indexOf(post.postId) !== -1)
      return true;

    return false;
  }

  delikePost(post) {
    const { likes } = this.item;
    this.item.likes = likes - 1;
    this.item.isLike = false;
    this.firebaseProvider.delikePost(post.postId)
    console.log(this.user.uid)
    this.mixpanelService.track("DislikePost", {
      post: post.postId,
      timestamp: Date.now()
    })
  }

  async commentPost(post) {

    let commentsAux = this.item.comments;
    console.log(post)
    let modal = await this.modalCtrl.create({
      component: CommentsPage,
      componentProps: { 
        postKey: post.postId,
        profilePic: this.user.profilePic ? this.user.profilePic : 'assets/profile.png',
        update: (comment: any) => {
          const { comments } = this.item;
          alert(1)
          if (comments) {
            this.item.comments = comments + 1;
          } else {
            this.item.comments = 1;
          }


          this.item.isComment = true;
        }
      }
    });
    modal.present();

    modal.onDidDismiss().then(data => {
      if(this.item.comments> commentsAux){
        this.notifications.sendNotification({
          userId: post.postBy,
          type: "comment",
          username: this.user.username,
          action: this.translate.get('notifications.commented'),
          body:  this.translate.get('notifications.yourpost'),
          senderId: this.user.userId,
          postId: post.postId
        })
      }
      console.log(data.data);           
    });
    // this.navCtrl.navigateForward('/tabs/reviews/comments/'+post.postId);

  }

  openMap(lat, long) {
    window.open('http://maps.google.com/maps?q=' + lat + ',' + long, '_system', 'location=yes')
  }

  // Enlarge image messages.
  async enlargeImage(img) {
    let imageModal = await this.modalCtrl.create({
      component: ImageModalPage,
      componentProps: { img }
    });
    imageModal.present();
  }

  //View User  
  viewUser(userId) {
    
    if(userId == this.firebaseProvider.getCurrentUserId()){
      this.navCtrl.navigateForward('tabs/profile');
    }else{

      this.mixpanelService.track("ViewUser", {
        source: "post",
        userId: userId,
        timestamp: Date.now()
      })
      this.navCtrl.navigateForward('tabs/user-info/'+userId);
    }

    
  }

  async openMenu(item, events) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: events,
      mode: 'ios',
      componentProps: {
        'postBy': item.postBy,
        'postId':item.postId,
        // 'taggedProducts':this.taggedProducts,
        'userId': this.user.userId,
      }
    });

    popover.onDidDismiss().then(data => {
      console.log(data.data);           
    });

    await popover.present();
  }


  async open_product(product, i){
    this.mixpanelService.track("OpenProduct", {
      source: "post",
      product: product.productId,
      timestamp: Date.now()
    })
    // console.log(products);
    // console.log(i);

   var productData ={}
    this.firebaseProvider.dataProvider.getProductById(product.productId).snapshotChanges()
    .pipe(map(actions => actions.map((snapshot:any) => {
      if(snapshot.key == 'shop_photos'){
        productData[snapshot.key] = JSON.parse(snapshot.payload.val());

      }else{
        productData[snapshot.key] = snapshot.payload.val();

      }

   })), take(1)).toPromise().then(async ()=>{
     productData['rating'] = product.rating
     console.log(productData)
    const modal = await this.modalCtrl.create({
      component: ProductTagComponent,
      cssClass: 'tagProduct-modal',
       showBackdrop: true,
       backdropDismiss: true,
       componentProps: {
        'product': productData,
        'type':"post",
        // 'taggedProducts':this.taggedProducts,
        'addedBodySizes':this.user.addedBodySizes ? this.user.addedBodySizes : false,
        'index':i
      }
    });
  
    modal.onDidDismiss().then((dataReturned) => {
      console.log(dataReturned);
      console.log("closed modal");
    });

    
    await modal.present().then(() => {
    });
  })



  }


  //ID WILL BE IMAGE
  showTags(post){
    if(!this.showTagsVar) 
      this.showTagsVar = post.image
    else
      this.showTagsVar = null
    if (this.touchtime == 0) {
      // set first click
      this.touchtime = new Date().getTime();
    } else {
        // compare first click to this click and see if they occurred within double click threshold
        if (((new Date().getTime()) - this.touchtime) < 600) {
            // double click occurred
            if(!post.isLike){
              this.likePost(post)
            }
            this.showTagsVar = post.image
            this.touchtime = 0;
            this.doubleTapped = true;
            setTimeout(()=>{
              this.doubleTapped = false;
            }, 500)
        } else {
            // not a double click so set as a new first click
            this.touchtime = new Date().getTime();
        }
    }
  

}

  getShowTags(id){
    return this.showTagsVar == id
  }
  
}
