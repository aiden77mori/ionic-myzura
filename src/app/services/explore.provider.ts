import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { BehaviorSubject, Observable } from 'rxjs';

import {tap, map, take } from 'rxjs/operators';
import { DataProvider } from './data.provider';
import { FirebaseProvider } from './firebase.provider';

@Injectable()
export class ExploreProvider {

  private _explore$ = new BehaviorSubject<any[]>([]);
  batch = 15;
  lastKey = '';
  finished = false;
  userId
  recommendedExplore=[]
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


  // setRecommendedExplore(explore){
  //   this.recommendedExplore = explore
  // }
  get explore$(): Observable<any[]> {
    return this._explore$.asObservable();
  }

  nextPage(): Observable<any[]> {
    if (this.finished) { return this.explore$; }
    return this.getExplore(this.batch + 1, this.lastKey)

      .pipe(
        tap(exploreIds => {

          console.log("HERE", exploreIds)
          // set the lastKey in preparation for next query
          this.lastKey = exploreIds[exploreIds.length-1]["id"];
          console.log(this.lastKey)
          const newExploreIds = exploreIds.slice(0, this.batch);
          console.log(newExploreIds)
          this.getExploreByIds(newExploreIds).then(explore =>{
            let newExplore = explore
            const currentExplore = this._explore$.getValue();

            console.log(currentExplore)
            // if data is identical, stop making queries
            if (this.lastKey == newExploreIds[newExploreIds.length-1]["id"]) {
              console.log("finished")
              this.finished = true;
            }
  
            this._explore$.next(currentExplore.concat(newExplore));
          })
          // get current explore in BehaviorSubject
         
        })
      );
  }

  private getExplore(batch: number, lastKey: string): Observable<any[]> {
    return this.mapListKeys<any>(
      this.db.list<any>(`recommendationSystem/accounts/${this.userId}/posts`, ref => {
        const query = ref.orderByKey().limitToFirst(batch); //ordeByKey required to startAt and endAt keys
        // const query = ref.limitToFirst(batch);
        return (this.lastKey) ? query.startAt(this.lastKey) : query;
      })
    );
  }

  //PROMISE ALL VERY COOL https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
  getExploreByIds(newExploreIds:any){
    return new Promise(async (resolve, reject) => {
      let newExplore =[]
      await Promise.all(newExploreIds.map(async (productId) => {
        await this.dataProvider.getTimelineListById(productId.key).query.once("value", res=>{
          newExplore.push(res.val())
        })
      }));
      
      console.log(newExplore)
      resolve(newExplore)

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
