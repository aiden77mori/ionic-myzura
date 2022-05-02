import { Component, ViewChild, ElementRef, NgZone, OnInit } from '@angular/core';
import { ModalController, IonInfiniteScroll, NavController, IonContent } from '@ionic/angular';

import firebase from 'firebase';
import _ from 'lodash';
// import { AnimationBuilder } from 'css-animator';
import { SafeHtml } from '@angular/platform-browser';
import { NativeGeocoder, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';

import { ActivatedRoute, Router } from '@angular/router';
import { take, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LoadingProvider } from 'src/app/services/loading.provider';
import { AngularFireDatabase } from '@angular/fire/database';
import { DataProvider } from 'src/app/services/data.provider';
import { FirebaseProvider } from 'src/app/services/firebase.provider';
import { FeedProvider } from 'src/app/services/feed.provider';
import { TranslateProvider } from 'src/app/services/translate.service';
import { SampleShellListingModel } from 'src/app/services/shell/sample-shell.model';
import { Events } from 'src/app/services/Events';
import { MixpanelService } from 'src/app/services/mixpanel.service';
@Component({
  selector: 'page-timeline',
  templateUrl: 'timeline.html',
  styleUrls: ['timeline.scss']
})



export class TimelinePage implements OnInit {
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent, { static: false }) content: IonContent;


  routeTimelineResolveData: SampleShellListingModel;

  private stories: Observable<any>;
  public loading: boolean = true;
  public user: any;
  public timelineData: any;
  public friendsList: any;
  private unreadGroupMessagesCount: any;
  private conversations: any;
  private conversationsInfo: any;
  private unreadMessagesCount: any;
  private page: number = 1;


  constructor(public router: Router,
    public translate: TranslateProvider,
    public loadingProvider: LoadingProvider,
    public angularDb: AngularFireDatabase,
    public dataProvider: DataProvider,
    public firebaseProvider: FirebaseProvider,
    private mixpanelService: MixpanelService,
    private nativeGeocoder: NativeGeocoder,
    public modalCtrl: ModalController,
    // public storyService: StoryService,
    public events: Events,
        private navCtrl: NavController,
    private feedProvider: FeedProvider,

    private route: ActivatedRoute

  ) {



  }

  // private animator: AnimationBuilder;


  //////start SCROLOL TOP
  ionViewWillEnter() {
    this.events.subscribe('tabs', tabNumber => {
        if (tabNumber === 'reviews') {
          this.content.scrollToTop(1000);
        }
    });
  }

  ionViewDidLeave() {
    // this.events.destroy('tabs');
  }
  //////END SCROLOL TOP


  goMessages() {
    this.navCtrl.navigateForward('tabs/messages');
  }

  getUnreadMessagesCount() {
    if (this.unreadMessagesCount) {
      if (this.unreadMessagesCount > 0) {
        return this.unreadMessagesCount;
      }
    }
    return null;
  }

  addOrUpdateConversation(conversation) {
    console.log('update conversation', conversation)
    if (!this.conversations) {
      this.conversations = [conversation];
    } else {
      var index = -1;
      for (var i = 0; i < this.conversations.length; i++) {
        if (this.conversations[i].valueChanges == conversation.valueChanges) {
          index = i;
        }
      }
      if (index > -1) {
        this.conversations[index] = conversation;
      } else {
        this.conversations.push(conversation);
      }

    }

    this.computeUnreadMessagesCount()
  }


  // Compute all conversation's unreadMessages.
  computeUnreadMessagesCount() {
    console.log(this.conversations)
    this.unreadMessagesCount = 0;
    if (this.conversations) {
      for (var i = 0; i < this.conversations.length; i++) {
        this.unreadMessagesCount += this.conversations[i].unreadMessagesCount;

        console.log(this.unreadMessagesCount)
        if (this.unreadMessagesCount == 0) {
          this.unreadMessagesCount = null;
        }
      }
    }
  }

  async ngOnInit() {
    // this.user = await this.dataProvider.getCurrentUser()
    //   .pipe(take(1))
    //   .toPromise();
    this.dataProvider.getCurrentUser().subscribe(async (user) => {
     this.user = user
    //  await this.dataProvider.getCurrentUser()
    //   .pipe(take(1))
    //   .toPromise();
    //   console.log('User data time line', user);

      this.loadingProvider.hide();
      const { following } = this.user;
      // let storiesList = [this.user.userId];

      // if (following)
      //   storiesList = [...storiesList, ...following];
    });





    // this.stories = this.angularDb.list('story').snapshotChanges()
    //   .pipe(map(snapshot => snapshot.map(item => {
    //     const data: any = item.payload.val();
    //     console.log('stories:', data);
    //     const today = new Date();
    //     const dateCreated = new Date(data.dateCreated);
    //     if ((storiesList.indexOf(data.storyBy) !== -1)
    //       && ((Math.abs(today.getTime() - dateCreated.getTime()) / 36e5) <= 24)) {
    //         console.log('seen?',Object.keys(data.seenBy)
    //         .filter(key => data.seenBy[key] === this.user.userId).length > 0);
    //       return {
    //         ...data, storyId: item.key,
    //         seen: data['seenBy'] &&
    //           (Object.keys(data.seenBy)
    //           .filter(key => data.seenBy[key] === this.user.userId).length > 0)
    //       };
    //     }
    //   }).filter(item => item !== undefined)
    //   ));

    // this.timelineData = await this.feedProvider.getTimeline();
    // if (this.elmRef.nativeElement.querySelector('hashtagevt')) {
    //   this.elmRef.nativeElement.querySelector('hashtagevt').addEventListener('click', alert(this));
    // }

    // console.log(this.timelineData)

    if (this.route && this.route.data) {
      // We resolved a promise for the data Observable
      const promiseObservable = this.route.data;
      console.log('Progressive Shell Resovlers - Route Resolve Observable => promiseObservable: ', promiseObservable);

      if (promiseObservable) {
        promiseObservable.subscribe(promiseValue => {
          const dataObservable = promiseValue['data'];
          console.log('Progressive Shell Resovlers - Subscribe to promiseObservable => dataObservable: ', dataObservable);

          if (dataObservable) {
            dataObservable.subscribe(observableValue => {
              const pageData: SampleShellListingModel = observableValue;
              // tslint:disable-next-line:max-line-length
              console.log('Progressive Shell Resovlers - Subscribe to dataObservable (can emmit multiple values) => PageData (' + ((pageData && pageData.isShell) ? 'SHELL' : 'REAL') + '): ', pageData);
              // As we are implementing an App Shell architecture, pageData will be firstly an empty shell model,
              // and the real remote data once it gets fetched
              //FIX THIS FOR PERFORMANCE!!!!!!!!

              if ( !pageData.isShell) {
                // let PREV = JSON.stringify(pageData?.items)
                // let NEW = JSON.stringify(this.routeTimelineResolveData?.items)
                let PREV = pageData?.items.length
                let NEW = this.routeTimelineResolveData?.items.length
                console.log(PREV, NEW)
                if(PREV != NEW){
                  console.log("NEW DATA")
                  this.routeTimelineResolveData = pageData;
                  this.loading = false;
                }
              }
            });
          } else {
            console.warn('No dataObservable coming from Route Resolver promiseObservable');
          }
        });
      } else {
        console.warn('No promiseObservable coming from Route Resolver data');
      }
    } else {
      console.warn('No data coming from Route Resolver');
    }
  }

  ionViewDidEnter() {

    //conversation
    this.dataProvider.getConversations().snapshotChanges()
      .pipe(
        map(actions => actions.map(snapshot => {
          const data: any = snapshot.payload.val();
          return { ...data, userId: snapshot.key };
        })))
      .subscribe((conversations: any) => {
        console.log('conversations', conversations);
        if (conversations.length > 0) {
          conversations.forEach((conversation: any) => {
            if (conversation) {
              // Get conversation partner info.
              console.log('listing conversation', conversation)
              this.dataProvider.getUser(conversation.userId).valueChanges().subscribe((user) => {
                conversation.friend = user;
                // Get conversation info.
                this.dataProvider.getConversation(conversation.valueChanges).valueChanges().subscribe((obj: any) => {

                  // Get last message of conversation.
                  console.log(conversation.valueChanges);
                  console.log(obj);
                  let lastMessage = obj.messages[obj.messages.length - 1];
                  conversation.date = lastMessage.date;
                  conversation.sender = lastMessage.sender;
                  // Set unreadMessagesCount
                  conversation.unreadMessagesCount = obj.messages.length - conversation.messagesRead;
                  // Process last message depending on messageType.
                  if (lastMessage.type == 'text') {
                    if (lastMessage.sender == firebase.auth().currentUser.uid) {
                      conversation.message = 'You: ' + lastMessage.message;
                    } else {
                      conversation.message = lastMessage.message;
                    }
                  } else {
                    if (lastMessage.sender == firebase.auth().currentUser.uid) {
                      conversation.message = 'You sent a photo message.';
                    } else {
                      conversation.message = 'has sent you a photo message.';
                    }
                  }
                  // Add or update conversation.
                  this.addOrUpdateConversation(conversation);
                });
              });
            }
          });
          this.loadingProvider.hide();
        } else {
          this.conversations = [];
          this.loadingProvider.hide();
        }
      });



    // Whenever the userData on the database is updated, it will automatically reflect on our user variable.
    //this.createUserData();
  }

  async loadData(evt: any){
    const promiseObservable = this.route.data;
    console.log('Progressive Shell Resovlers - Route Resolve Observable => promiseObservable: ', promiseObservable);

    // if (promiseObservable) {
    //   promiseObservable.subscribe(promiseValue => {
    //     const dataObservable = promiseValue['data'];
    //     console.log('Progressive Shell Resovlers - Subscribe to promiseObservable => dataObservable: ', dataObservable);

    //     if (dataObservable) {
    //       dataObservable.subscribe(observableValue => {
    //         const pageData: SampleShellListingModel = observableValue;
    //         // tslint:disable-next-line:max-line-length
    //         console.log('Progressive Shell Resovlers - Subscribe to dataObservable (can emmit multiple values) => PageData (' + ((pageData && pageData.isShell) ? 'SHELL' : 'REAL') + '): ', pageData);
    //         // As we are implementing an App Shell architecture, pageData will be firstly an empty shell model,
    //         // and the real remote data once it gets fetched
    //         if (pageData) {
    //           this.routeTimelineResolveData = pageData;

    //           console.log(this.routeTimelineResolveData)
    //           evt.target.complete();


    //         }
    //       });
    //     } else {
    //       console.warn('No dataObservable coming from Route Resolver promiseObservable');
    //     }
    //   });
    // } else {
    //   console.warn('No promiseObservable coming from Route Resolver data');
    // }
    this.page = this.page + 1;
    let timelineData:any = await this.feedProvider.getTimeline(this.page);
    this.routeTimelineResolveData.items = timelineData.items;
    evt.target.complete();
  }

  // Create userData on the database if it doesn't exist yet.
  createUserData() {
    firebase.database().ref('accounts/' + firebase.auth().currentUser.uid).once('value')
      .then((account) => {
        // No database data yet, create user data on database
        if (!account.val()) {
          let user = firebase.auth().currentUser;
          console.log(user);
          //debugger

          var userId, name, provider, img, email;
          let providerData = user.providerData[0];

          userId = user.uid;

          // Get name from Firebase user.
          if (user.displayName || providerData.displayName) {
            name = user.displayName;
            name = providerData.displayName;
          } else {
            name = "Firebase User";
          }

          // Set default username based on name and userId.
          let username = name.replace(/ /g, '') + userId.substring(0, 8);

          // Get provider from Firebase user.
          if (providerData.providerId == 'password') {
            provider = "Firebase";
          } else if (providerData.providerId == 'facebook.com') {
            provider = "Facebook";
          } else if (providerData.providerId == 'google.com') {
            provider = "Google";
          } else if (providerData.providerId == 'phone') {
            provider = "Phone";
          }

          // Get photoURL from Firebase user.
          if (user.photoURL || providerData.photoURL) {
            img = user.photoURL;
            img = providerData.photoURL;
          } else {
            img = "./assets/images/profile.png";
          }

          // Get email from Firebase user.
          email = user.email ? user.email : user.phoneNumber;

          // Set default description.
          let description = "Hello! I am a new facebookclone user.";
          console.log({
            userId: userId,
            name: name,
            username: username,
            provider: provider,
            img: img,
            email: email,
            description: description,
            dateCreated: new Date().toString()
          });

          // Insert data on our database using AngularFire.
          this.angularDb.object('/accounts/' + userId).set({
            userId: userId,
            name: name,
            username: username,
            provider: provider,
            img: img,
            email: email,
            description: description,
            dateCreated: new Date().toString()
          }).then(() => {
            console.log('hide')
            this.loadingProvider.hide();
          }).catch(err => this.loadingProvider.hide());

        }

      }).catch(err => { });
  }

  // Add or update timeline data for real-time sync.
  addOrUpdateTimeline(timeline) {
    if (!this.timelineData) {
      this.timelineData = [timeline];
    } else {
      var index = -1;
      for (var i = 0; i < this.timelineData.length; i++) {
        console.log('addorupdate1', this.timelineData[i]);
        console.log('addorupdate2', timeline);

        if (this.timelineData[i].postId === timeline.postId) {
          index = i;
        }
      }
      if (index > -1) {
        this.timelineData[index] = timeline;
      } else {
        this.timelineData.unshift(timeline);
      }
    }
  }

  //Create Hashtag Links
  createHashtag(text: String): SafeHtml {
    let str = text;
    if (!str || str === '')
      return '';

    let res = str.split(/[ ]/);
    return res;
  }

  locationAddress(location, success) {

    // this.nativeGeocoder.reverseGeocode(location.lat, location.long)
    //   .then((result: any) => {
    //     console.log('ReverseGeoCode', JSON.stringify(result));
    //     success(result);
    //   }).catch((error: any) => console.log('GeocodeError', error));
  }


  searchFriends(){
    this.navCtrl.navigateForward('tabs/explore')
  }

  conlog(){
    console.log(this.routeTimelineResolveData)
  }
}
