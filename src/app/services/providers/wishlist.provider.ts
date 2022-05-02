import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { BehaviorSubject, Observable } from 'rxjs';

import {tap, map, take } from 'rxjs/operators';
import { DataProvider } from '../data.provider';
import { FirebaseProvider } from '../firebase.provider';

@Injectable()
export class WhishlistProvider {

  private _whishlist$ = new BehaviorSubject<any[]>([]);
  batch = 15;
  lastKey = '';
  finished = false;
  userId
  constructor(
    public db: AngularFireDatabase,
    private firebaseProvider: FirebaseProvider,

    private dataProvider: DataProvider
  ) {
    this.userId = this.firebaseProvider.getCurrentUserId();
  }



  // setRecommendedWhishlist(whishlist){
  //   this.recommendedWhishlist = whishlist
  // }
  get whishlist$(): Observable<any[]> {
    return this._whishlist$.asObservable();
  }
  destroy(){
    this._whishlist$ = new BehaviorSubject<any[]>([]);
    this.batch = 15;
    this.lastKey = '';
    this.finished = false;
  }
  nextPage(): Observable<any[]> {
    if (this.finished) { return this.whishlist$; }
    return this.getWhishlist(this.batch + 1, this.lastKey)

      .pipe(
        tap(whishlistIds => {

          try {
            console.log("HERE", whishlistIds)
            // set the lastKey in preparation for next query
            this.lastKey = whishlistIds[whishlistIds.length-1]["id"];
            console.log(this.lastKey)
            const newWhishlistIds = whishlistIds.slice(0, this.batch);
            console.log(newWhishlistIds)
            this.getProductsByIds(newWhishlistIds).then(whishlist =>{
              let newWhishlist = whishlist
              const currentWhishlist = this._whishlist$.getValue();

              console.log(currentWhishlist)
              // if data is identical, stop making queries
              if (this.lastKey == newWhishlistIds[newWhishlistIds.length-1]["id"]) {
                console.log("finished")
                this.finished = true;
              }

              this._whishlist$.next(currentWhishlist.concat(newWhishlist));
            })
          } catch (error) {
            console.log(error)
            this.destroy()
          }
          // get current whishlist in BehaviorSubject

        })
      );
  }

  private getWhishlist(batch: number, lastKey: string): Observable<any[]> {
    return this.mapListKeys<any>(
      this.db.list<any>(`wishlist/${this.userId}/products/`, ref => {
        const query = ref.orderByKey().limitToFirst(batch); //ordeByKey required to startAt and endAt keys
        // const query = ref.limitToFirst(batch);
        return (this.lastKey) ? query.startAt(this.lastKey) : query;
      })
    );
  }

  //PROMISE ALL VERY COOL https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
  getProductsByIds(newWhishlistIds:any){
    return new Promise(async (resolve, reject) => {
      let newWhishlist =[]
      await Promise.all(newWhishlistIds.map(async (productId) => {
        await this.dataProvider.getProductById(productId.key).query.once("value", res=>{
          console.log(res.val())
          newWhishlist.push(res.val())
        })
      }));

      console.log(newWhishlist)
      resolve(newWhishlist)

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
