import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, NavController } from '@ionic/angular';

 import _ from 'lodash';
 

 import { Observable } from 'rxjs';
import { DataProvider } from '../../services/data.provider';
import { FirebaseProvider } from '../../services/firebase.provider';
 import { TranslateProvider } from 'src/app/services/translate.service';
import { SampleShellListingModel } from 'src/app/services/shell/sample-shell.model';
 
 import { map, take } from 'rxjs/operators';
 import {
  DomSanitizer,
  SafeHtml,
  SafeUrl,
  SafeStyle
} from '@angular/platform-browser';
/**
 * This page show us user's friends posts 
 * and following users posts
 *
 */

@Component({
  selector: 'page-outfits',
  templateUrl: 'outfits.html',
  styleUrls: ['outfits.scss']
})
export class OutfitsPage implements OnInit {
  
  public outfitsData
  userId
 
 
  constructor(
     public translate: TranslateProvider,
      public dataProvider: DataProvider,
      public firebaseProvider: FirebaseProvider,
      private changeDetectorRef: ChangeDetectorRef,
      private navCtrl : NavController,
      private sanitization: DomSanitizer
      // private outfitsProvider: OutfitsProvider,
      // private outfitsService: OutfitsService,
     // public storyService: StoryService
    ) {


  }



  async ngOnInit() {
    // [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19].forEach(i => {
      
    //   this.outfitsService.testOutfits({
    //     userId: "lgCYeA0wiETVaXMFfzuyXuGJcSd2",
    //     type:"Liked", 
    //     senderId:"06Di5gBhDgOPar60pbY6OEgKg1e2",
    //     username: "userId" + i,
    //     title: "MyZura",
    //     body: "userId" + i + " Liked " + " your picture."
    //   })
    // });
    // this.dataProvider.getOutfits().query.once("value", res=>{
    //   this.fullOutfits = Object.values(res.val())
    // })


 
  }

  getUser(userId){
    return new Promise<any>(async (resolve, reject) => {
       this.dataProvider.getUser(userId).query.once("value", res=>{
        resolve(res.val())
       })
    })
  }

  // getOutfitsData(data){
  //   return new Promise<any>(async (resolve, reject) => {
  //     let listData = []

  //     for(var i = 0; i<data.length ; i++){
  //       await this.getUser(data[i].senderId).then((d:any)=>{
  //          console.log(i)
  //          data[i].photo = d.profilePic;
  //          if(data[i].type!='message'){
  //           listData.push(data[i])
  //          }
           
  //        })
  //      }

  //      resolve(listData)
  //   })
  // }

  //////start SCROLOL TOP
  async ionViewWillEnter() {
    this.loadOutfits()

  }


  async loadOutfits(){

    this.dataProvider.getCurrentUser().subscribe(async (user:any) => {
      this.userId = user.userId
       await this.dataProvider.getOutfits(this.userId)
       .snapshotChanges() // key and value pairs, or access to these pairs 
       .pipe(
        map(actions => actions.map(snapshot => {
          const data: any = snapshot.payload.val();
          return { ...data, key: snapshot.key };
        })))
      .subscribe((outfits: any) => {
        this.outfitsData = outfits;
      })
       
    })

  }
  loadData(event){
    this.loadOutfits()
    event.target.complete();

  }
  // doInfinite(infiniteScrollEvent): Promise<void> {
  //   console.log("infiniteScrollEvent")
  //   console.log(infiniteScrollEvent)
  //   if (!this.outfitsData.finished) {
  //     return new Promise((resolve, reject) => {

  //       this.outfitsProvider.nextPage()
  //         .pipe(take(1))
  //         .subscribe(outfits => {
  //           console.log('Outfits!', outfits);
  //           infiniteScrollEvent.target.complete();

  //           // this.outfits$ = this.outfitsProvider.outfits$;


  //           resolve();
  //         });

  //     });
  //   }
  //   return Promise.resolve();
  // }

  ionViewDidLeave() {
    // this.events.destroy('tabs');
  }
  //////END SCROLOL TOP
  //ADD RESET A FALSE IF CHANGED
   

  async openFilters(){

  }

  //View User  
  viewUser(userId) {
    // this.router.navigateByUrl('tabs/user-info', { state: { userId } });
  }

 
  openOptions(param) {

  }


  openQr(){
    alert("COMING SOON")
  }

  openUpdateOutfit(key) {
    let navigationExtras = {
      queryParams: {
        outfitId:  key,
      }
    };
    this.navCtrl.navigateForward('tabs/update-outfit/',navigationExtras)
  }

   openAddOutfit() {
    this.navCtrl.navigateForward('tabs/add-outfit');
  }

  getSaniImage(image){
    return this.sanitization.bypassSecurityTrustStyle(`url(${image})`)
  }

}
