import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { BehaviorSubject, Observable, of } from 'rxjs';

import {tap, map, take } from 'rxjs/operators';
import { DataProvider } from '../data.provider';
import { FirebaseProvider } from '../firebase.provider';

@Injectable()
export class LocalProductsProvider {

  private _localProducts$ = new BehaviorSubject<any[]>([]);
  batch = 15;
  startKey = 0;
  finished = false;
  userId
  productsListIDs=[]

  public setList(ids){
    this.productsListIDs = ids

    
    this.nextPage()
      .pipe(take(1))
      .subscribe();
  }
  constructor(
    public db: AngularFireDatabase,
    private firebaseProvider: FirebaseProvider,

    private dataProvider: DataProvider
  ) {
    this.userId = this.firebaseProvider.getCurrentUserId();

  }


  // setRecommendedProducts(products){
  //   this.recommendedProducts = products
  // }
  get localProducts$(): Observable<any[]> {
    return this._localProducts$.asObservable();
  }
  destroy(){
    this._localProducts$ = new BehaviorSubject<any[]>([]);
    this.batch = 15;
    this.startKey = 0;
    this.finished = false;
  }
  nextPage(): Observable<any[]> {
    if (this.finished) { return this.localProducts$; }
    return this.getProducts(this.startKey)
      .pipe(
        tap(productsIds => {
          console.log("HERE", productsIds)
          // set the startKey in preparation for next query
          // this.startKey = productsIds[productsIds.length-1]["id"];
          // console.log(this.startKey)
          // const newProductsIds = productsIds.slice(0, this.batch);
          // console.log(newProductsIds)
          if(productsIds.length && this.startKey<this.productsListIDs.length){ 
            this.getProductsByIds(productsIds).then(products =>{
              let newProducts = products
              const currentProducts = this._localProducts$.getValue();
  
              console.log(currentProducts)
              // if data is identical, stop making queries
              if (this.startKey >= this.productsListIDs.length) {
                console.log("finished")
                this.finished = true;
              }
    
              this._localProducts$.next(currentProducts.concat(newProducts));
              this.startKey += this.batch

            })
          }

          // get current products in BehaviorSubject
         
        })
      );
  }

  private getProducts(startKey: number){
      // let size = this.productsListIDs.length
      // if(startKey<=size-1){   slice already does the job
      return of(this.productsListIDs.slice(startKey, startKey+this.batch))

  }

  //PROMISE ALL VERY COOL https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
  getProductsByIds(newProductsIds:any){
    return new Promise(async (resolve, reject) => {
      let newProducts =[]
      await Promise.all(newProductsIds.map(async (productId) => {
        await this.dataProvider.getProductById(productId).query.once("value", res=>{
          newProducts.push(res.val())
        })
      }));
      
      resolve(newProducts)

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
