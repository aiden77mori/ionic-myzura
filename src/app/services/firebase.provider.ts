import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';
import { LoadingProvider } from './loading.provider';
import { AlertProvider } from './alert.provider';
import { DataProvider } from './data.provider';

@Injectable({ providedIn: 'root' })
export class FirebaseProvider {
  // Firebase Provider
  // This is the provider class for most of the Firebase updates in the app.

  constructor(public angularDb: AngularFireDatabase, public loadingProvider: LoadingProvider, public alertProvider: AlertProvider, public dataProvider: DataProvider) {
    console.log("Initializing Firebase Provider");
  }

  // Send friend request to userId.
  sendFriendRequest(userId) {
    let loggedInUserId = firebase.auth().currentUser.uid;
    this.loadingProvider.show();

    var requestsSent;
    // Use take(1) so that subscription will only trigger once.
    // .take(1)
    this.dataProvider.getRequests(loggedInUserId).pipe(take(1)).subscribe((requests: any) => {
      requestsSent = requests.requestsSent;
      if (!requestsSent) {
        requestsSent = [userId];
      } else {
        if (requestsSent.indexOf(userId) == -1)
          requestsSent.push(userId);
      }
      // Add requestsSent information.
      this.angularDb.object('/requests/' + loggedInUserId).update({
        requestsSent: requestsSent
      }).then((success) => {
        var friendRequests;
        //take(1)
        this.dataProvider.getRequests(userId).pipe(take(1)).subscribe((requests: any) => {
          friendRequests = requests.friendRequests;
          if (!friendRequests) {
            friendRequests = [loggedInUserId];
          } else {
            if (friendRequests.indexOf(userId) == -1)
              friendRequests.push(loggedInUserId);
          }
          // Add friendRequest information.
          this.angularDb.object('/requests/' + userId).update({
            friendRequests: friendRequests
          }).then((success) => {
            this.loadingProvider.hide();
            this.alertProvider.showFriendRequestSent();
          }).catch((error) => {
            this.loadingProvider.hide();
          });
        });
      }).catch((error) => {
        this.loadingProvider.hide();
      });
    });
  }

  getCurrentUserId(){
    return this.dataProvider.getCurrentUserId()
  }

  // Cancel friend request sent to userId.
  cancelFriendRequest(userId) {
    let loggedInUserId = firebase.auth().currentUser.uid;
    this.loadingProvider.show();

    var requestsSent;
    //take(1)
    this.dataProvider.getRequests(loggedInUserId).pipe(take(1)).subscribe((requests: any) => {
      requestsSent = requests.requestsSent;
      requestsSent.splice(requestsSent.indexOf(userId), 1);
      // Update requestSent information.
      this.angularDb.object('/requests/' + loggedInUserId).update({
        requestsSent: requestsSent
      }).then((success) => {
        var friendRequests;
        // take(1)
        this.dataProvider.getRequests(userId).pipe(take(1)).subscribe((requests: any) => {
          friendRequests = requests.friendRequests;
          friendRequests.splice(friendRequests.indexOf(loggedInUserId), 1);
          // Update friendRequests information.
          this.angularDb.object('/requests/' + userId).update({
            friendRequests: friendRequests
          }).then((success) => {
            this.loadingProvider.hide();
            this.alertProvider.showFriendRequestRemoved();
          }).catch((error) => {
            this.loadingProvider.hide();
          });
        });
      }).catch((error) => {
        this.loadingProvider.hide();
      });
    });
  }

  // Delete friend request.
  deleteFriendRequest(userId) {
    let loggedInUserId = firebase.auth().currentUser.uid;
    this.loadingProvider.show();

    var friendRequests;
    //take(1)
    this.dataProvider.getRequests(loggedInUserId).pipe(take(1)).subscribe((requests: any) => {
      friendRequests = requests.friendRequests;
      friendRequests.splice(friendRequests.indexOf(userId), 1);
      // Update friendRequests information.
      this.angularDb.object('/requests/' + loggedInUserId).update({
        friendRequests: friendRequests
      }).then((success) => {
        var requestsSent;
        //take one
        this.dataProvider.getRequests(userId).pipe(take(1)).subscribe((requests: any) => {
          requestsSent = requests.requestsSent;
          requestsSent.splice(requestsSent.indexOf(loggedInUserId), 1);
          // Update requestsSent information.
          this.angularDb.object('/requests/' + userId).update({
            requestsSent: requestsSent
          }).then((success) => {
            this.loadingProvider.hide();

          }).catch((error) => {
            this.loadingProvider.hide();
          });
        });
      }).catch((error) => {
        this.loadingProvider.hide();
        //TODO ERROR
      });
    });
  }

  // Accept friend request.
  acceptFriendRequest(userId) {
    let loggedInUserId = firebase.auth().currentUser.uid;
    // Delete friend request.
    this.deleteFriendRequest(userId);

    this.loadingProvider.show();
    //take(1)
    this.dataProvider.getUser(loggedInUserId).valueChanges().pipe(take(1)).subscribe((account: any) => {
      var friends = account.friends;
      if (!friends) {
        friends = [userId];
      } else {
        friends.push(userId);
      }
      // Add both users as friends.
      this.dataProvider.getUser(loggedInUserId).update({
        friends: friends
      }).then((success) => {
        //take one
        this.dataProvider.getUser(userId).valueChanges().pipe(take(1)).subscribe((account: any) => {
          var friends = account.friends;
          if (!friends) {
            friends = [loggedInUserId];
          } else {
            friends.push(loggedInUserId);
          }
          this.dataProvider.getUser(userId).update({
            friends: friends
          }).then((success) => {
            this.loadingProvider.hide();
          }).catch((error) => {
            this.loadingProvider.hide();
          });
        });
      }).catch((error) => {
        this.loadingProvider.hide();
      });
    });
  }

  //Follow User
  followUser(userId) {
    let loggedInUserId = firebase.auth().currentUser.uid;


    //take(1)
    this.dataProvider.getUser(loggedInUserId).valueChanges().pipe(take(1)).subscribe((account: any) => {
      var following = account.following;
      if (!following) {
        following = [userId];
      } else {
        following.push(userId);
      }

      this.dataProvider.getUser(loggedInUserId).update({
        following: following
      }).then((success) => {
        //take(1)
        this.dataProvider.getUser(userId).valueChanges().pipe(take(1)).subscribe((data: any) => {
          var followers = data.followers;

          if (!followers) {
            followers = [loggedInUserId];
          } else {
            followers.push(loggedInUserId);
          }
          this.dataProvider.getUser(userId).update({
            followers: followers
          });
        });

      }).catch((error) => {
        console.log(error);

      });
    });
  }

  //Unfollow User
  unfollowUser(userId) {
    let loggedInUserId = firebase.auth().currentUser.uid;
    //take(1)
    this.dataProvider.getUser(loggedInUserId).valueChanges().pipe(take(1)).subscribe((account: any) => {
      var following = account.following;

      following.splice(following.indexOf(userId), 1);


      this.dataProvider.getUser(loggedInUserId).update({
        following: following
      }).then((success) => {
        //take(1)
        this.dataProvider.getUser(userId).valueChanges().pipe(take(1)).subscribe((data: any) => {
          var followers = data.followers;
          console.log('Unfollow', data);

          followers.splice(followers.indexOf(loggedInUserId), 1);
          this.dataProvider.getUser(userId).update({
            followers: followers
          });
        });


      }).catch((error) => {
        console.log(error);

      });
    });
  }

  // TimeLine
  timeline(timelineId) {
    let loggedInUserId = firebase.auth().currentUser.uid;
    //take(1)
    this.dataProvider.getUser(loggedInUserId).valueChanges().pipe(take(1)).subscribe((account: any) => {
      var timeline = account.timeline;
      if (!timeline) {
        timeline = [timelineId];
      } else {
        timeline.push(timelineId);
      }
      // Add both users as friends.
      this.dataProvider.getUser(loggedInUserId).update({
        timeline: timeline
      }).then((success) => {

      }).catch((error) => {
        this.loadingProvider.hide();
      });
    });
  }

  //Favorite
  bookmarkPost(key) {
    let loggedInUserId = firebase.auth().currentUser.uid;

    this.dataProvider.getUser(loggedInUserId).valueChanges().pipe(take(1)).toPromise()
      .then((account: any) => {
        var bookmark = account.bookmark;

        if (!bookmark) {
          bookmark = [key];
        } else {
          if (bookmark.indexOf(key) === -1) {
            bookmark.push(key);
          } else {
            bookmark.splice(bookmark.indexOf(key), 1);
          }
        }

        this.dataProvider.getUser(loggedInUserId).update({
          bookmark
        }).catch((error) => {
          console.log(error);
        });
      });
  }

  // ==== Like postBy
  likePost(key) {
    return new Promise((resolve, reject) => {
      //take(1)
      this.dataProvider.postLike(key).valueChanges().pipe(take(1)).subscribe((likes: any) => {
        console.log('LIKE', likes)
        var likes = likes;
        if (!likes || !likes.length) {
          likes = [firebase.auth().currentUser.uid];
        } else {
          likes.push(firebase.auth().currentUser.uid);
        }
        // Add both users as friends.
        this.dataProvider.postLike(key).update(likes).then((success) => {
          // alert('sc')
          resolve(true)
        }).catch((error) => {
          this.loadingProvider.hide();
          console.log("err", error)
          reject(false)
        });
      });
    })
  }

  //delete Post
  deletePost(post) {
    this.loadingProvider.show();
    console.log(post);

    this.dataProvider.getTimelinesId(post.value).valueChanges().subscribe((data) => {
      this.dataProvider.getTimeline(post.key).remove();
      this.dataProvider.postLike(post.key).remove();
      this.dataProvider.getComments(post.key).remove();
    });
    this.dataProvider.getTimelinesId(post.value).remove().then((success) => {
      this.loadingProvider.hide();
      console.log(success);
    }).catch((error) => {
      this.loadingProvider.hide();
      console.log(error);
    });
  }

  deletePostMyzura(postId) {

    this.dataProvider.getTimelineById(postId).update({deleted:true}).then((success) => {
      console.log(success);
    }).catch((error) => {
      console.log(error);
    });
  }


  // ==== Like postBy
  delikePost(key) {
    return new Promise((resolve, reject) => {
      //take(1)
      this.dataProvider.postLike(key).valueChanges().pipe(take(1)).subscribe((likes: any) => {
        console.log(likes)
        likes.splice(likes.indexOf(firebase.auth().currentUser.uid), 1);
        if (likes.length) {
          //alert(likes.length)
          this.angularDb.object('likes/' + key).remove()

          this.dataProvider.postLike(key).set(likes).then((success) => {
            // alert('sc')
            resolve(true)
          }).catch((error) => {
            this.loadingProvider.hide();
            console.log("err", error)
            reject(false)
          });
        } else {
          this.angularDb.object('likes/' + key).remove()
        }

      });
    })
  }

  commentPost(key, comment) {
    return new Promise((resolve, reject) => {
      //take(1)
      this.dataProvider.getComments(key).valueChanges().pipe(take(1)).subscribe((comments) => {
        var comments = comments;
        if (!comments) {
          comments = [comment];
        } else {
          comments.push(comment);
        }
        // Add both users as friends.
        this.dataProvider.postComments(key).update(comments).then((success) => {
          resolve(true)
        }).catch((error) => {
          this.loadingProvider.hide();
          console.log("err", error)
          reject(false)
        });
      });
    })

  }

  updateUserBodyMeasures(body, measures, userId){

    console.log( this.getCurrentUserId())

this.dataProvider.angularDb.database.ref('accounts/' +userId + "/userBody").set(body)
this.dataProvider.angularDb.database.ref('accounts/' +userId + "/bodyMeasures").set(measures)
}
}
