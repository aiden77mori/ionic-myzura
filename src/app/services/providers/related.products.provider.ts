import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { BehaviorSubject, Observable, of } from 'rxjs';

import {tap, map, take } from 'rxjs/operators';
import { DataProvider } from '../data.provider';
import { FirebaseProvider } from '../firebase.provider';

@Injectable()
export class RelatedProductsProvider {

  private _relatedProducts$ = new BehaviorSubject<any[]>([]);
  batch = 15;
  lastKey = '';
  public productId = '';
  finished = false;
  constructor(
    public db: AngularFireDatabase,

    private dataProvider: DataProvider
  ) {


    ///DIDNT WORK CHECK CONSTRUCOTR OF PRODUCTS DETAILS
    // alert(1)
    // this.nextPage()
    //   .pipe(take(1))
    //   .subscribe();
  }

  public setProductId(id) {
    this.productId = id
    this.nextPage()
    .pipe(take(1))
    .subscribe(products => {

    });
  }
  get relatedProducts$(): Observable<any[]> {
    return this._relatedProducts$.asObservable();
  }
  destroy(){
    this._relatedProducts$ = new BehaviorSubject<any[]>([]);
    this.batch = 15;
    this.lastKey = '';
    this.productId = '';
    this.finished = false;
  }
  nextPage(): Observable<any[]> {
    if (this.finished) { return this.relatedProducts$; }
    return this.getProducts(this.batch + 1, this.lastKey)

      .pipe(
        tap(productsIds => {

          console.log("HERE", productsIds)
          // set the lastKey in preparation for next query
          this.lastKey = productsIds[productsIds.length-1]["id"];
          console.log(this.lastKey)
          const newProductsIds = productsIds.slice(0, this.batch);
          console.log(newProductsIds)
          this.getProductsByIds(newProductsIds).then(products =>{
            let newProducts = products
            const currentProducts = this._relatedProducts$.getValue();

            console.log(currentProducts)
            // if data is identical, stop making queries
            if (this.lastKey == newProductsIds[newProductsIds.length-1]["id"]) {
              console.log("finished")
              this.finished = true;
            }
  
            this._relatedProducts$.next(currentProducts.concat(newProducts));
          })
          // get current products in BehaviorSubject
         
        })
      );
  }

  private getProducts(batch: number, lastKey: string): Observable<any[]> {
    return this.mapListKeys<any>(
      this.db.list<any>(`productRelated/${this.productId}/related`, ref => {
        const query = ref.orderByKey().limitToFirst(batch); //ordeByKey required to startAt and endAt keys
        // const query = ref.limitToFirst(batch);
        return (this.lastKey) ? query.startAt(this.lastKey) : query;
      })
    );
  }

  //PROMISE ALL VERY COOL https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
  getProductsByIds(newProductsIds:any){
    return new Promise(async (resolve, reject) => {
      let newProducts =[]
      await Promise.all(newProductsIds.map(async (productId) => {
        await this.dataProvider.getProductById(productId.key).query.once("value", res=>{
          console.log(res.val())
          newProducts.push(res.val())
        })
      }));
      
      console.log(newProducts)
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
