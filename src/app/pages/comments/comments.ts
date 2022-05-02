import { Component, Input } from '@angular/core';
import firebase from 'firebase';
import { ModalController, NavController } from '@ionic/angular';
import { FirebaseProvider } from '../../services/firebase.provider';
import { DataProvider } from '../../services/data.provider';
import { TranslateProvider } from '../../services/translate.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
  styleUrls: ['comments.scss']
})
export class CommentsPage {
  @Input() postKey: string;
  @Input() profilePic: string;
  // @Input() update: any;
  commentText: any;
  comments: any;
  constructor(
    public firebaseProvider: FirebaseProvider,
    public dataProvider: DataProvider,
    public translate: TranslateProvider,
    public navCtrl: NavController,
    private route: ActivatedRoute,
    public modalCtrl: ModalController) {
      console.log(this.postKey)
  }

  ionViewDidEnter() {
    console.log(this.postKey);
    console.log('ionViewDidLoad CommentsPage');
    this.dataProvider.getComments(this.postKey).valueChanges().subscribe((comments: any) => {
      console.log("commnets================", comments)
      if (this.comments) {
        let tempComments = comments[comments.length - 1];
        let tempData = <any>{};
        tempData = tempComments;
        this.dataProvider.getUser(tempComments.commentBy).valueChanges().subscribe((user: any) => {
          tempData.avatar = user.photos? user.photos["128"] : user.profilePic;
          tempData.name = user.name
        });
        // this.addOrUpdateTimeline(tempData)
        this.comments.push(tempData);
      } else {
        this.comments = []
        comments.forEach((comment) => {
          if (comment) {
            let tempComment = comment;
            let tempData = <any>{};
            tempData = tempComment;
            this.dataProvider.getUser(tempComment.commentBy).valueChanges().subscribe((user: any) => {
              tempData.avatar = user.photos? user.photos["128"] : user.profilePic;
              tempData.name = user.name
            });
            // TO AVOID COMMENTS FROM DELETED USERS
            // if(tempData.avatar && tempData.name){
            //   this.comments.push(tempData);
            // }

            this.comments.push(tempData);
          }
        })
      }
    })
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }

  back() {
    this.navCtrl.back();
  }


  postComment() {
    if(this.commentText){
      let comment = {
        dateCreated: new Date().toString(),
        commentBy: firebase.auth().currentUser.uid,
        commentText: this.commentText,
      }
      this.firebaseProvider.commentPost(this.postKey, comment).then((res) => {
        // if (this.update) this.update(comment);
        this.commentText = ''
      })
    }

  }
}
