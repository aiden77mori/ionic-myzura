
import { Injectable, OnInit } from '@angular/core';
import firebase from 'firebase';
import { map, take } from 'rxjs/operators';
import { CommonProvider } from './common.provider';
import _ from 'lodash';
import { SafeHtml } from '@angular/platform-browser';
import { AngularFireDatabase } from '@angular/fire/database';
import { DataProvider } from './data.provider';

@Injectable({ providedIn: 'root' })
export class FeedProvider {
  feeds: any[];

  private timelinePostIds: any[] = [];
  private timelinePosts: any[] = [];

  private activePage: number = 1;


  constructor(
    private angularDb: AngularFireDatabase,
    private commonProvider: CommonProvider,
    private dataProvider: DataProvider
  ) {
    this.feeds = [];
  }


  async getTimeline(page: number = 1) {
    let posts: any[] = [];
    let timelinePosts: any[] = [];
    const pageSize = 1;

    console.log(`getTimeline.page(${page})`);
    const { uid } = firebase.auth().currentUser;
    let timelineIds = [uid];

    const user: any = await this.angularDb.object(`/accounts/${uid}`)
      .valueChanges()
      .pipe(take(1))
      .toPromise()
      .catch(res => console.log(res));


    console.log('getTimeline.user', user);
    if (!user) return [];

    const { following } = user;

    // Get all following users
    if (following) {
      timelineIds = [...timelineIds, ...following];
    }

    // Get all postIds
    const prPostId = timelineIds.map(async (userId: string) => {
      const userPosts: any = await this.angularDb.list(`/accounts/${userId}/timeline`)
        .valueChanges()
        .pipe(take(1))
        .toPromise()
        .catch(err => console.log(err));

      userPosts.map(postId => {
        if (timelinePosts.indexOf(postId) === -1) {
          timelinePosts.push(postId);
        }
      });
    });

    await Promise.all(prPostId);

    let pagePostIds: any[] = [];
    pagePostIds = timelinePosts;

    // if (page === 1) {
    //   pagePostIds = this.timelinePostIds.slice(0, pageSize);
    // } else {
    //   //  ((page_number - 1) * page_size, page_number * page_size
    //   pagePostIds = this.timelinePostIds.slice((page - 1) * pageSize, page * pageSize);
    // }

    console.log('getTimeline.pagePostIds', pagePostIds);

    console.log('getTimeline.userPosts', timelinePosts);

    const pUser = pagePostIds.map(async (postId: string) => {
      let tempData: any = await this.angularDb.object(`/timeline/${postId}`)
        .snapshotChanges()
        .pipe(
          map((snapshot: any) => {
            const data: any = snapshot.payload.val();
            return { ...data, postId: snapshot.key };
          }), take(1))
        .toPromise()
        .catch(err => console.log(err));

      if(tempData?.deleted == false){

        // Getting Post Owner information
        const postUser: any = await this.angularDb.object(`/accounts/${tempData.postBy}`)
          .valueChanges()
          .pipe(take(1))
          .toPromise()
          .catch(err => console.log(err));
        if (postUser) {
          tempData.avatar = postUser.photos? postUser.photos["128"] : postUser.profilePic;
          tempData.name = postUser.name;
          tempData.username = postUser.username;
        }

        //Check Location
        // if (tempData.location) {
        //   let tempLocaion = JSON.parse(tempData.location);
        //   tempData.lat = tempLocaion.lat;
        //   tempData.long = tempLocaion.long;

        //   this.commonProvider.locationAddress(tempLocaion, (res: any) => {
        //     let address = res[0];
        //     tempData.locationAddress = address.subAdministrativeArea + ", " + address.countryCode;
        //   });
        // }

        //  ===== check like
        this.angularDb.list(`/likes/${tempData.postId}`).valueChanges().subscribe((likes) => {
          tempData.likes = likes.length;
          // Check post like or not

          let isLike = _.findKey(likes, (like) => {
            let _tempLike = <any>like;
            return _tempLike == firebase.auth().currentUser.uid;
          })

          if (isLike) {
            tempData.isLike = true;
          } else {
            tempData.isLike = false;
          }
        });

        //  ===== check commnets
        this.angularDb.list(`/comments/${tempData.postId}`).valueChanges().subscribe((comments) => {
          // console.log("====comm",comments)
          tempData.comments = comments.length;
          // Check post like or not

          let isComments = _.findKey(comments, (comment) => {
            let _tempComment = <any>comment;
            return _tempComment.commentBy == firebase.auth().currentUser.uid;
          })

          if (isComments) {
            tempData.isComment = true;
          } else {
            tempData.isComment = false;
          }

        });

        tempData.postText = this.createHashtag(tempData.postText);

        posts.unshift(tempData);
      }
    });

    await Promise.all(pUser);

    // Concat with the page
    // this.timelinePosts = [...this.timelinePosts, ...posts];
    // this.timelinePosts = [...posts];

    //BUG: REMOVE DUPLICATES ISSUE!!!!!!!!
    posts =posts.reduce((acc, val) => {
      if (!acc.find(el => el.postId === val.postId)) {
        acc.push(val);
      }
      return acc;
    }, []);
    if (posts && posts.length > 0) {
      posts.sort(function (a, b) {
        var d1 = new Date(a.dateCreated);
        var d2 = new Date(b.dateCreated);
        return (d1 > d2) ? -1 : ((d2 > d1) ? 1 : 0);
      });
    }


    let ret = {}
    ret['items'] = posts
    return ret;
  }

  async getTimelineById(postId: any) {

      let tempData: any = await this.angularDb.object(`/timeline/${postId}`)
      .snapshotChanges()
      .pipe(
        map((snapshot: any) => {
          const data: any = snapshot.payload.val();
          return { ...data, postId: snapshot.key };
        }), take(1))
      .toPromise()
      .catch(err => console.log(err));

    // Getting Post Owner information
    const postUser: any = await this.angularDb.object(`/accounts/${tempData.postBy}`)
      .valueChanges()
      .pipe(take(1))
      .toPromise()
      .catch(err => console.log(err));
    if (postUser) {
      tempData.avatar = postUser.photos? postUser.photos["128"] : postUser.profilePic;
      tempData.name = postUser.name;
      tempData.username = postUser.username;
    }
      //  ===== check like
      const like = this.angularDb.list(`/likes/${tempData.postId}`).valueChanges().subscribe((likes) => {
        tempData.likes = likes.length;
        // Check post like or not

        let isLike = _.findKey(likes, (like) => {
          let _tempLike = <any>like;
          return _tempLike == firebase.auth().currentUser.uid;
        })

        if (isLike) {
          tempData.isLike = true;
        } else {
          tempData.isLike = false;
        }
      });

      //  ===== check commnets
      const com = this.angularDb.list(`/comments/${tempData.postId}`).valueChanges().subscribe((comments) => {
        // console.log("====comm",comments)
        tempData.comments = comments.length;
        // Check post like or not

        let isComments = _.findKey(comments, (comment) => {
          let _tempComment = <any>comment;
          return _tempComment.commentBy == firebase.auth().currentUser.uid;
        })

        if (isComments) {
          tempData.isComment = true;
        } else {
          tempData.isComment = false;
        }

      });

      tempData.postText = this.createHashtag(tempData.postText);

      // posts.unshift(tempData);


    await Promise.all([com, like]);


    return tempData;
  }

  async getTimelineProducts(reviews) {

    let posts: any[] = [];

    for (var key in reviews) {
      console.log(key)
      // check also if property is not inherited from prototype
      let postId = reviews[key].timelineId

      let tempData: any = await this.angularDb.object(`/timeline/${postId}`)
          .snapshotChanges()
          .pipe(
            map((snapshot: any) => {
              const data: any = snapshot.payload.val();
              return { ...data, postId: snapshot.key };
            }), take(1))
          .toPromise()
          .catch(err => console.log(err));

     if(tempData.deleted == false){
        // Getting Post Owner information
        const postUser: any = await this.angularDb.object(`/accounts/${tempData.postBy}`)
          .valueChanges()
          .pipe(take(1))
          .toPromise()
          .catch(err => console.log(err));
        if (postUser) {
          tempData.avatar = postUser.photos? postUser.photos["128"] : postUser.profilePic;
          tempData.name = postUser.name;
          tempData.username = postUser.username;
        }

        // //Check Location
        // if (tempData.location) {
        //   let tempLocaion = JSON.parse(tempData.location);
        //   tempData.lat = tempLocaion.lat;
        //   tempData.long = tempLocaion.long;

        //   this.commonProvider.locationAddress(tempLocaion, (res: any) => {
        //     let address = res[0];
        //     tempData.locationAddress = address.subAdministrativeArea + ", " + address.countryCode;
        //   });
        // }

        //  ===== check like
        this.angularDb.list(`/likes/${tempData.postId}`).valueChanges().subscribe((likes) => {
          tempData.likes = likes.length;
          // Check post like or not

          let isLike = _.findKey(likes, (like) => {
            let _tempLike = <any>like;
            return _tempLike == firebase.auth().currentUser.uid;
          })

          if (isLike) {
            tempData.isLike = true;
          } else {
            tempData.isLike = false;
          }
        });

        //  ===== check commnets
        this.angularDb.list(`/comments/${tempData.postId}`).valueChanges().subscribe((comments) => {
          // console.log("====comm",comments)
          tempData.comments = comments.length;
          // Check post like or not

          let isComments = _.findKey(comments, (comment) => {
            let _tempComment = <any>comment;
            return _tempComment.commentBy == firebase.auth().currentUser.uid;
          })

          if (isComments) {
            tempData.isComment = true;
          } else {
            tempData.isComment = false;
          }

        });

        tempData.postText = this.createHashtag(tempData.postText);

        posts.unshift(tempData);
     }
    }



    posts = posts.reduce((acc, val) => {
      if (!acc.find(el => el.postId === val.postId)) {
        acc.push(val);
      }
      return acc;
    }, []);
    if (posts && posts.length > 0) {
      posts.sort(function (a, b) {
        var d1 = new Date(a.dateCreated);
        var d2 = new Date(b.dateCreated);
        return (d1 > d2) ? -1 : ((d2 > d1) ? 1 : 0);
      });
    }

    return posts;
  }


  async getProfilePosts(){
    let posts: any[] = [];
    const pageSize = 1;
    let timelinePostIds = []
    const { uid } = firebase.auth().currentUser;
    let timelineIds = [uid];

    const user: any = await this.angularDb.object(`/accounts/${uid}`)
      .valueChanges()
      .pipe(take(1))
      .toPromise()
      .catch(res => console.log(res));


    if (!user) return [];

    // Get all postIds
    const prPostId = timelineIds.map(async (userId: string) => {
      const userPosts: any = await this.angularDb.list(`/accounts/${userId}/timeline`)
        .valueChanges()
        .pipe(take(1))
        .toPromise()
        .catch(err => console.log(err));

      userPosts.map(postId => {
        if (timelinePostIds.indexOf(postId) === -1) {
          timelinePostIds.push(postId);
        }
      });
    });

    await Promise.all(prPostId);

    let pagePostIds: any[] = [];
    pagePostIds = timelinePostIds;


    const pUser = pagePostIds.map(async (postId: string) => {
      let tempData: any = await this.angularDb.object(`/timeline/${postId}`)
        .snapshotChanges()
        .pipe(
          map((snapshot: any) => {
            const data: any = snapshot.payload.val();
            return { ...data, postId: snapshot.key };
          }), take(1))
        .toPromise()
        .catch(err => console.log(err));

        if(tempData.deleted == false){
           // Getting Post Owner information
          const postUser: any = await this.angularDb.object(`/accounts/${tempData.postBy}`)
            .valueChanges()
            .pipe(take(1))
            .toPromise()
            .catch(err => console.log(err));
          if (postUser) {
            tempData.avatar = postUser.photos? postUser.photos["128"] : postUser.profilePic;
            tempData.name = postUser.name;
            tempData.username = postUser.username;
          }

          // //Check Location
          // if (tempData.location) {
          //   let tempLocaion = JSON.parse(tempData.location);
          //   tempData.lat = tempLocaion.lat;
          //   tempData.long = tempLocaion.long;

          //   this.commonProvider.locationAddress(tempLocaion, (res: any) => {
          //     let address = res[0];
          //     tempData.locationAddress = address.subAdministrativeArea + ", " + address.countryCode;
          //   });
          // }

          //  ===== check like
          this.angularDb.list(`/likes/${tempData.postId}`).valueChanges().subscribe((likes) => {
            tempData.likes = likes.length;
            // Check post like or not

            let isLike = _.findKey(likes, (like) => {
              let _tempLike = <any>like;
              return _tempLike == firebase.auth().currentUser.uid;
            })

            if (isLike) {
              tempData.isLike = true;
            } else {
              tempData.isLike = false;
            }
          });

          //  ===== check commnets
          this.angularDb.list(`/comments/${tempData.postId}`).valueChanges().subscribe((comments) => {
            // console.log("====comm",comments)
            tempData.comments = comments.length;
            // Check post like or not

            let isComments = _.findKey(comments, (comment) => {
              let _tempComment = <any>comment;
              return _tempComment.commentBy == firebase.auth().currentUser.uid;
            })

            if (isComments) {
              tempData.isComment = true;
            } else {
              tempData.isComment = false;
            }

          });

          tempData.postText = this.createHashtag(tempData.postText);

          posts.unshift(tempData);
        }
    });

    await Promise.all(pUser);

    // Concat with the page

    //BUG: REMOVE DUPLICATES ISSUE!!!!!!!!
    // posts = posts.reduce((acc, val) => {
    //   if (!acc.find(el => el.postId === val.postId)) {
    //     acc.push(val);
    //   }
    //   return acc;
    // }, []);
    if (posts && posts.length > 0) {
      posts.sort(function (a, b) {
        var d1 = new Date(a.dateCreated);
        var d2 = new Date(b.dateCreated);
        return (d1 > d2) ? -1 : ((d2 > d1) ? 1 : 0);
      });
    }


    let ret = {}
    ret['items'] = posts
    return ret;
  }


  async getProducts(){
    let productsData = [];
    //Get Products
    const productsList: any = await this.dataProvider.getProducts()
    .snapshotChanges()
    .pipe(map(actions => actions.map(snapshot => {
      const data: any = snapshot.payload.val();
      // let keys:any = [];
      // try {
      //   keys = Object.keys(data)
      // } catch (error) {

      // }
      // if(keys.length>5) //at least more than 5, now we have 1 colors:{}
        return data //{ ...data, postId: snapshot.key };
    })), take(1))
    .toPromise().then(data=>{
      productsData = data;

    })
    let res = {}
    res['items'] = productsData
    return res;
  }
  //Create Hashtag Links
  createHashtag(text: String): SafeHtml {
    let str = text;
    if (!str || str === '')
      return '';

    let res = str.split(/[ ]/);
    return res;
  }


  getFeed(): any[] {
    return this.feeds;
  }

  addFeed(obj: Object) {
    this.feeds.unshift(obj);
  }

}
