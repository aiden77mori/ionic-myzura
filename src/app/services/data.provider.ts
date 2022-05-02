import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';

import firebase from 'firebase';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataProvider {
  // Data Provider
  // This is the provider class for most of the Firebase observables in the app.
  currentUser: firebase.User;

  constructor(public angularDb: AngularFireDatabase, private afAuth: AngularFireAuth) {

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        this.currentUser = user;
      } else {
        // No user is signed in.
        this.currentUser = null;
      }
    });
  }

  getLoggedInUser() {
    return this.currentUser;
  }

  setLoggedInUser(user) {
    this.currentUser = user;
  }

  // Get all users
  getUsers() {
    return this.angularDb.list('/accounts', ref => ref.orderByChild('name'));
  }
  getSuggestedUsers() {
    return this.angularDb.list('/accounts', ref => ref.equalTo(1).orderByChild('suggested').limitToFirst(6));      //1 or 0
  }
  // Get user with username
  getUserWithUsername(username) {
    return this.angularDb.list('/accounts', ref => ref.equalTo(username).orderByChild('username'));
  }

  // Get logged in user data
  getCurrentUserId() {
    if (this.currentUser.uid){
      return this.currentUser.uid
    }else{
      return firebase.auth().currentUser.uid;
    }
  }
  getCurrentUser() {
    if (!this.currentUser.uid) return;
    return this.angularDb.object('/accounts/' + this.currentUser.uid).valueChanges();
  }
  getCurrentUserRef() {
    if (!this.currentUser.uid) return;
    return this.angularDb.object('/accounts/' + this.currentUser.uid)
  }


  // Get user by their userId
  getUser(userId) {
    return this.angularDb.object('/accounts/' + userId);
  }

  // Get user by their userId
  getUserRef(userId) {
    return this.angularDb.database.ref('/accounts/' + userId);
  }

  // Get requests given the userId.
  getRequests(userId) {
    return this.angularDb.object('/requests/' + userId).valueChanges();
  }

  // Get friend requests given the userId.
  getFriendRequests(userId) {
    return this.angularDb.list('/requests', ref => ref.orderByChild('receiver').equalTo(userId)).valueChanges();
  }

  // Get conversation given the conversationId.
  getConversation(conversationId) {
    return this.angularDb.object('/conversations/' + conversationId);
  }

  // Get conversations of the current logged in user.
  getConversations(){
    // const uid = this.afAuth.auth.currentUser.uid;
    if (!this.currentUser.uid) return;

    return this.angularDb.list('/accounts/' + this.currentUser.uid + '/conversations');
  }

  // Get messages of the conversation given the Id.
  getConversationMessages(conversationId) {
    return this.angularDb.object('/conversations/' + conversationId + '/messages').valueChanges();
  }

  // Get messages of the group given the Id.
  getGroupMessages(groupId) {
    return this.angularDb.object('/groups/' + groupId + '/messages').valueChanges();
  }

  // Get groups of the logged in user.
  getGroups() {
    return this.angularDb.list('/accounts/' + firebase.auth().currentUser.uid + '/groups').valueChanges();
  }

  // Get group info given the groupId.
  getGroup(groupId) {
    return this.angularDb.object('/groups/' + groupId);
  }

  // Get Timeline of user
  getTimelines() {
    return this.angularDb.list('/accounts/' + firebase.auth().currentUser.uid + '/timeline').valueChanges();
  }

  // // Get Timeline of user
  getTimelinesId(timelineId) {
    const res = this.angularDb.object('/accounts/' + firebase.auth().currentUser.uid + '/timeline/' + timelineId);
    return res;
  }
  // getPostRefById(timelineId) {
  //   const res = this.angularDb.database.ref('/timeline/' + timelineId);
  //   return res;
  // }

  //CLOSET
  getCLoset() {
    const res = this.angularDb.object('/accounts/' + firebase.auth().currentUser.uid + '/closet/');
    return res;
  }

  getCLosetRef() {
    const res = this.angularDb.database.ref('/accounts/' + firebase.auth().currentUser.uid + '/closet/');
    return res;
  }

  getCLosetPlusRef() {
    const res = this.angularDb.database.ref('/accounts/' + firebase.auth().currentUser.uid + '/closetPlus/');
    return res;
  }

  getCLosetByUserId(userId) {
    const res = this.angularDb.object('/accounts/' + userId + '/closet/');
    return res;
  }
  getCLosetList() {
    const res = this.angularDb.list('/accounts/' + firebase.auth().currentUser.uid + '/closet/', ref => ref.orderByChild("timestamp"));
    return res;
  }


  // addCLoset(data) {
  //   const res = this.angularDb.object('/accounts/' + firebase.auth().currentUser.uid + '/closet/').;
  //   return res;
  // }

  getCLosetPlus() {
    const res = this.angularDb.object('/accounts/' + firebase.auth().currentUser.uid + '/closetPlus/');
    return res;
  }


  getCLosetPlusList() {
    const res = this.angularDb.list('/accounts/' + firebase.auth().currentUser.uid + '/closetPlus/', ref => ref.orderByChild("timestamp"));
    return res;
  }

  deleteCLosetPlusListProductById(productKey){
    console.log(productKey)

    const res = this.angularDb.database.ref('/accounts/' + firebase.auth().currentUser.uid + '/closetPlus/'+productKey).remove().then(res=>{
      console.log(res)
    })
  }

  deleteCLosetListProductById(productKey){
    console.log(productKey)
    const res = this.angularDb.database.ref('/accounts/' + firebase.auth().currentUser.uid + '/closet/'+productKey).remove().then(res=>{
      console.log(res)
    })
  }


  ////SIZE Clothes
  getSizesByUserInfo(brand, gender, continent,category){
    console.log('/clothingSizes/' + firebase.auth().currentUser.uid +
    `/generalBrandsSizes/${brand}/${gender}/${continent}/${category}/size_labels_1`)
    const res = this.angularDb.database.ref('/clothingSizes/' + firebase.auth().currentUser.uid +
    `/generalBrandsSizes/${brand}/${gender}/${continent}/${category}/size_labels_1`);
    return res;
  }

  // Get PRODUCTS
  getProducts() {
    return this.angularDb.list('/products', ref=>ref.limitToFirst(1000));//.valueChanges();
  }

  getProductsRef() {
    return this.angularDb.database.ref('/products');//.valueChanges();
  }
  getProductsRecommended(userId) {
    return this.angularDb.list(`recommendationSystem/accounts/${userId}/products`);//.valueChanges();
  }

  getProductById(productId: string) {
    return this.angularDb.list('/products/'+productId);//.valueChanges();
  }


  getProductByLink(link) {
    return this.angularDb.list('/products/', ref=>ref.equalTo(link).orderByChild("shop_url"));//.valueChanges();
  }



  getTimelineListById(timelineId) {
    return this.angularDb.list('/timeline/' + timelineId);
  }
  // Get Timeline post
  getTimelinePost() {
    return this.angularDb.list('/timeline');//.valueChanges();
  }

  // Get time line by id
  getTimeline(timelineId) {
    return this.angularDb.object('/timeline/' + timelineId);
  }


  getTimelineById(timelineId) {
    return this.angularDb.object('/timeline/' + timelineId);
  }



  getInterests(timelineId) {
    return this.angularDb.list('/accounts/' + timelineId + '/timeline').valueChanges();
  }

  // Get Friend List
  getFriends() {
    return this.angularDb.list('/accounts/' + firebase.auth().currentUser.uid + '/friends').valueChanges();
  }

  // Get comments list
  getComments(postId) {
    return this.angularDb.list('/comments/' + postId);
  }

  // Get likes
  getLike(postId) {
    return this.angularDb.list('/likes/' + postId).valueChanges();
  }

  postLike(postId) {
    return this.angularDb.object('/likes/' + postId)
  }

  // post Comments
  postComments(postId) {
    return this.angularDb.object('/comments/' + postId);
  }

  getDefaultBodyTypeData(){
    return this.angularDb.object("defaultData/bodyTypes/");
  }

  getDefaultUsernames(){
    return this.angularDb.object("defaultData/usernames/");
  }
  addProductWishlist(id){
    this.checkProductWishlist(id).then((check) => {
      if(!check){
        const res = this.angularDb.database.ref('/wishlist/' + firebase.auth().currentUser.uid +
        `/products`);
        res.push(id)
        alert("Added to wishlist")
      }else{
        alert("ALREADY IN WISHLIST")
      }
    })

  }

  checkProductWishlist(id){
    const res = this.angularDb.database.ref('/wishlist/' + firebase.auth().currentUser.uid +
    `/products`);
    return new Promise((resolve, reject)=>{
      if(id){
        res.orderByValue().equalTo(id).once("value", res=> {
          console.log("CHECKED")
          if(res.val() == null){
            resolve(false)
          }else{
            resolve(true)
          }
        })
      }else{
        resolve(false)
      }
    })
  }

  removeProductWishlist(id){
    let userId = firebase.auth().currentUser.uid
    const res = this.angularDb.database.ref('/wishlist/' +userId+
    `/products`);
    res.orderByValue().equalTo(id).once("value", res=> {
      console.log("CHECKED")
      if(res.val() != null){
        console.log(res)
        let key=Object.keys(res.val())[0]

        this.angularDb.database.ref('/wishlist/' +userId+ `/products/${key}/`).remove()
        alert("REMOVED FROM WISHLIST")

      }else{
      }
    })
  }



  getNotifications(userId) {
    return this.angularDb.list('/notifications/' + userId);
  }

  getFavBrands(userId) {
    return this.angularDb.object('/favoriteBrands/' + userId);
  }

  getNewMarketplaceProducts() {
    return this.angularDb.list('/newMarketplaceProducts/', ref => ref.orderByChild('isVisible').equalTo(true));
  }
  getOutfits(userId) {
    return this.angularDb.list('/outfits/' + userId);
  }

  getBrandNames() {
    return this.angularDb.list('/brands/');
  }

  getNotificationsOrdered(userId) {
    return this.angularDb.list('/notifications/' + userId, ref => ref.orderByChild('date').limitToLast(10));      //1 or 0
  }
}
