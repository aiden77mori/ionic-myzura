import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';

 import _ from 'lodash';
 

 import { Observable } from 'rxjs';
import { DataProvider } from '../../services/data.provider';
import { FirebaseProvider } from '../../services/firebase.provider';
 import { TranslateProvider } from 'src/app/services/translate.service';
import { SampleShellListingModel } from 'src/app/services/shell/sample-shell.model';
 
import { NotificationsService } from 'src/app/services/notifications.service';
import { take } from 'rxjs/operators';
import { NotificationsProvider } from 'src/app/services/providers/notifications.provide';

/**
 * This page show us user's friends posts 
 * and following users posts
 *
 */

@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
  styleUrls: ['notifications.scss']
})
export class NotificationsPage implements OnInit {
  
  public notificationsData
  userId
 
 
  constructor(
     public translate: TranslateProvider,
      public dataProvider: DataProvider,
      public firebaseProvider: FirebaseProvider,
      private changeDetectorRef: ChangeDetectorRef
      // private notificationsProvider: NotificationsProvider,
      // private notificationsService: NotificationsService,
     // public storyService: StoryService
    ) {


  }



  async ngOnInit() {
    this.loadNotifications()
    // [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19].forEach(i => {
      
    //   this.notificationsService.testNotifications({
    //     userId: "lgCYeA0wiETVaXMFfzuyXuGJcSd2",
    //     type:"Liked", 
    //     senderId:"06Di5gBhDgOPar60pbY6OEgKg1e2",
    //     username: "userId" + i,
    //     title: "MyZura",
    //     body: "userId" + i + " Liked " + " your picture."
    //   })
    // });
    // this.dataProvider.getNotifications().query.once("value", res=>{
    //   this.fullNotifications = Object.values(res.val())
    // })


 
  }

  getUser(userId){
    return new Promise<any>(async (resolve, reject) => {
       this.dataProvider.getUser(userId).query.once("value", res=>{
        resolve(res.val())
       })
    })
  }

  getNotificationsData(data){
    return new Promise<any>(async (resolve, reject) => {
      let listData = []

      for(var i = 0; i<data.length ; i++){
        await this.getUser(data[i].senderId).then((d:any)=>{
           console.log(i)
           data[i].photo = d.profilePic;
           if(data[i].type!='message'){
            listData.push(data[i])
           }
           
         })
       }

       resolve(listData)
    })
  }

  //////start SCROLOL TOP
  async ionViewWillEnter() {
    
  }


  async loadNotifications(){

    this.dataProvider.getCurrentUser().subscribe(async (user:any) => {
      this.userId = user.userId
       await this.dataProvider.getNotificationsOrdered(this.userId).query.once("value", async res=>{
        console.log(res)
        let data:any= Object.values(res.val())
        data = data.reverse() //recent to old
        await this.getNotificationsData(data).then(r=>{
           this.notificationsData = r
          console.log(this.notificationsData)
          this.changeDetectorRef.detectChanges();
        })
        
      })
    })

  }
  loadData(event){
    this.loadNotifications()
    event.target.complete();
  }
  // doInfinite(infiniteScrollEvent): Promise<void> {
  //   console.log("infiniteScrollEvent")
  //   console.log(infiniteScrollEvent)
  //   if (!this.notificationsData.finished) {
  //     return new Promise((resolve, reject) => {

  //       this.notificationsProvider.nextPage()
  //         .pipe(take(1))
  //         .subscribe(notifications => {
  //           console.log('Notifications!', notifications);
  //           infiniteScrollEvent.target.complete();

  //           // this.notifications$ = this.notificationsProvider.notifications$;


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
}
