/**
 * Shoppr - E-commerce app starter Ionic 4(https://www.enappd.com)
 *
 * Copyright © 2018-present Enappd. All rights reserved.
 *
 * This source code is licensed as per the terms found in the
 * LICENSE.md file in the root directory of this source .
 * 
 */
import { Component, OnInit, Input, OnChanges } from '@angular/core';
// import { Product } from '../data.service';
// import { FunctionsService } from '../functions.service';
import { NavController } from '@ionic/angular';
import { FirebaseProvider } from 'src/app/services/firebase.provider';

@Component({
  selector: 'app-innerhome',
  templateUrl: './innerhome.component.html',
  styleUrls: ['./innerhome.component.scss'],
  inputs: ['recieved_data']
})
export class InnerhomeComponent implements OnInit, OnChanges {

  @Input() productsData: Array<any>;
  @Input() wishlisted?:boolean;


  constructor( private firebaseProvider: FirebaseProvider,private nav: NavController) {
    console.log(this.productsData)
  }

  ngOnInit() {
    console.log(this.productsData)

  }

  ngOnChanges() {
    console.log(this.productsData)
  }

  open(id){
    // this.fun.update(data);
    this.nav.navigateForward('/tabs/product-details/'+id);
  }
  addWishList( i, id){
    this.firebaseProvider.dataProvider.addProductWishlist(id)
    this.productsData[i].wishlisted = true
  }

  // async checkWishList(id){
  //   return this.firebaseProvider.dataProvider.checkProductWishlist(id)
  // }

  removeProductWishlist(i, id){
    this.firebaseProvider.dataProvider.removeProductWishlist(id)
    this.productsData[i].wishlisted = false
  }
}
