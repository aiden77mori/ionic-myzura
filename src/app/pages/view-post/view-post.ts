import { Component, Input } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { CommentsPage } from '../../pages/comments/comments';

import { ImageModalPage } from '../../pages/image-modal/image-modal';
import { TabsService } from '../../util/tabservice';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FirebaseProvider } from 'src/app/services/firebase.provider';
import { DataProvider } from 'src/app/services/data.provider';
import { LoadingProvider } from 'src/app/services/loading.provider';
import { FeedProvider } from 'src/app/services/feed.provider';
import { MixpanelService } from 'src/app/services/mixpanel.service';

@Component({
  selector: 'page-view-post',
  templateUrl: 'view-post.html',
  styleUrls: ['view-post.scss']
})
export class ViewPostPage {
  @Input() post: any;
  public user: any;
  public item: any;
  postId: any
  constructor(
    private firebaseProvider: FirebaseProvider,
    private modalCtrl: ModalController,
    private dataProvider: DataProvider,
    private loadingProvider: LoadingProvider,
    private tabService: TabsService,
    private feedProvider: FeedProvider,
    private router: Router,
    private route: ActivatedRoute,
    private mixpanelService: MixpanelService,
    private navCtrl: NavController) {
      this.route.params.subscribe(async queryParams => {
        console.log(queryParams)
        this.postId = queryParams["postId"]
        console.log(this.postId)
        this.feedProvider.getTimelineById(this.postId).then(post=>{
          console.log(post)
          this.item = post
        })
      });

  }

  back = () => this.navCtrl.back();

  ionViewDidEnter() {
    // const { post } = (window as any).history.state;
    // this.item = post;
    // console.log('post data', post);


  }

  ionViewWillEnter() {
    // Observe the userData on database to be used by our markup html.
    // Whenever the userData on the database is updated, it will automatically reflect on our user variable.     
    // //this.createUserData();
    this.dataProvider.getCurrentUser().subscribe((user) => {
      this.user = <any>user;
      this.mixpanelService.setUserId(this.user.uid)
      this.mixpanelService.track("ViewPost", {
        post: this.postId,
        timestamp: Date.now()
      })
      console.log('ViewPost User', this.user);
      this.loadingProvider.hide();
    });   
  }



  likePost(post) {    
    this.item.isLike = true;
    this.firebaseProvider.likePost(post.postId);
  }

  bookmarkPost(post) {
    this.firebaseProvider.bookmarkPost(post.postId);

  }

  isFavorite(post) {
    console.log(this.user);
    if (!this.user)
      return false;

    const { bookmark } = this.user;

    if (!bookmark)
      return false;

    if (bookmark.indexOf(post.postId) !== -1)
      return true;

    return false;
  }

  delikePost(post) {
    this.item.isLike = false;
    this.firebaseProvider.delikePost(post.postId);
  }

  async commentPost(post) {

    let modal = await this.modalCtrl.create({
      component: CommentsPage,
      componentProps: {
        postKey: post.postId, update: (comment) => {
          let { comments } = this.item;
          if (!comments) {
            comments = [comment]
          } else {
            comments.push(comment);
          }
          this.item.isComment = true;          
        }
      }
    });
    modal.present();
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
    this.router.navigateByUrl('tabs/user-info', { state: { userId } });
  }

  


  
}
