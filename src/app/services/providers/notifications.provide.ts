import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { BehaviorSubject, Observable } from 'rxjs';

import {tap, map, take } from 'rxjs/operators';
import { DataProvider } from '../data.provider';
import { FirebaseProvider } from '../firebase.provider';

@Injectable()
export class NotificationsProvider {

  private _notifications$ = new BehaviorSubject<any[]>([]);
  batch = 15;
  lastKey = '';
  finished = false;
  userId
  recommendedNotifications=[]
  constructor(
    public db: AngularFireDatabase,
    private firebaseProvider: FirebaseProvider,

    private dataProvider: DataProvider
  ) {
    this.userId = this.firebaseProvider.getCurrentUserId();

    this.nextPage()
      .pipe(take(1))
      .subscribe();
  }


  // setRecommendedNotifications(notifications){
  //   this.recommendedNotifications = notifications
  // }
  get notifications$(): Observable<any[]> {
    return this._notifications$.asObservable();
  }

  nextPage(): Observable<any[]> {
    if (this.finished) { return this.notifications$; }
    return this.getNotifications(this.batch + 1, this.lastKey)

      .pipe(
        tap(notificationsIds => {

          console.log("HERE", notificationsIds)
          // set the lastKey in preparation for next query
          this.lastKey = notificationsIds[notificationsIds.length-1]["id"];
          console.log(this.lastKey)
          const newNotificationsIds = notificationsIds.slice(0, this.batch);
          console.log(newNotificationsIds)
          this.getNotificationsByIds(newNotificationsIds).then(notifications =>{
            let newNotifications = notifications
            const currentNotifications = this._notifications$.getValue();

            console.log(currentNotifications)
            // if data is identical, stop making queries
            if (this.lastKey == newNotificationsIds[newNotificationsIds.length-1]["id"]) {
              console.log("finished")
              this.finished = true;
            }
  
            this._notifications$.next(currentNotifications.concat(newNotifications));
          })
          // get current notifications in BehaviorSubject
         
        })
      );
  }

  private getNotifications(batch: number, lastKey: string): Observable<any[]> {
    return this.mapListKeys<any>(
      this.db.list<any>(`recommendationSystem/accounts/${this.userId}/notifications`, ref => {
        const query = ref.orderByKey().limitToFirst(batch); //ordeByKey required to startAt and endAt keys
        // const query = ref.limitToFirst(batch);
        return (this.lastKey) ? query.startAt(this.lastKey) : query;
      })
    );
  }

  //PROMISE ALL VERY COOL https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
  getNotificationsByIds(newNotificationsIds:any){
    return new Promise(async (resolve, reject) => {
      let newNotifications =[]
      await Promise.all(newNotificationsIds.map(async (productId) => {
        await this.dataProvider.getProductById(productId.key).query.once("value", res=>{
          console.log(res.val())
          newNotifications.push(res.val())
        })
      }));
      
      console.log(newNotifications)
      resolve(newNotifications)

    })
  }
  mapListKeys<T>(list: AngularFireList<T>): Observable<any[]> {
    return list
      .snapshotChanges().
      pipe(map(actions => actions.map(action => (
        {id: action.key, key:action.payload.val() }      
      ))));

  }

}
