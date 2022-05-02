import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, ModalController, NavController } from '@ionic/angular';

 import _ from 'lodash';
 
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
 import { LoadingProvider } from '../../services/loading.provider';
import { AngularFireDatabase } from '@angular/fire/database';
import { DataProvider } from '../../services/data.provider';
import { FirebaseProvider } from '../../services/firebase.provider';
 import { TranslateProvider } from 'src/app/services/translate.service';
import { SampleShellListingModel } from 'src/app/services/shell/sample-shell.model';
import { ExploreProvider } from 'src/app/services/explore.provider';
 import { MyZuraApiService } from 'src/app/services/myzura.api.service';
 import { Events } from 'src/app/services/Events';

/**
 * This page show us user's friends posts 
 * and following users posts
 *
 */

@Component({
  selector: 'page-explore',
  templateUrl: 'explore.html',
  styleUrls: ['explore.scss']
})
export class ExplorePage implements OnInit {
  routeExploreResolveData: SampleShellListingModel;
  @ViewChild(IonContent, { static: false }) content: IonContent;


  private user: any;
  public exploreData: any =[];
  public friendsList: any;
  public users: any;
  searchUser: String;
  public accounts: any;
  public alert: any;
  public account: any;
  public excludedIds: any = [];
  following :any


  hash: boolean = false;
  icons: string = 'post';
  public stories: Observable<any>;
  public loading: boolean = true;

  explore$: Observable<any[]>;
  public outputFilters={

    categories:[],
    brands:[], 
    color:"",
    gender:"Male",
    price:null,
    reset:true
  }


  userId
  recommendedExplore=[]
  fullExplore = []


  constructor(
    private router: Router,
    private myzuraApi:MyZuraApiService,
    private location: Location,
    public translate: TranslateProvider,
    public loadingProvider: LoadingProvider,
    public angularDb: AngularFireDatabase,
    public dataProvider: DataProvider,
    public exploreProvider: ExploreProvider,
    public firebaseProvider: FirebaseProvider,
    private navCtrl: NavController,
    public events: Events,
    public modalCtrl: ModalController,
    public route: ActivatedRoute
    // public storyService: StoryService
    ) {


  }



  async ngOnInit() {
    // this.dataProvider.getExplore().query.once("value", res=>{
    //   this.fullExplore = Object.values(res.val())

    // })

    this.explore$ = this.exploreProvider.explore$;

 
  }

  //////start SCROLOL TOP
  ionViewWillEnter() {
    this.events.subscribe('tabs', tabNumber => {
        if (tabNumber === 'explore') { 
          this.content.scrollToTop(1000); 
        } 
    });
  }

  ionViewDidLeave() {
    // this.events.destroy('tabs');
  }
  //////END SCROLOL TOP
  //ADD RESET A FALSE IF CHANGED
  searchEvent(){
    if(this.searchUser){
      this.outputFilters.reset=false;
    }else{
      this.outputFilters.reset=true;

    }
  }

  async openFilters(){

  }
 
  back() {
    this.location.back();
  }
  openOptions(param) {

  }


  doInfinite(infiniteScrollEvent): Promise<void> {
    console.log("infiniteScrollEvent")
    console.log(infiniteScrollEvent)
    if (!this.exploreData.finished) {
      return new Promise((resolve, reject) => {

        this.exploreProvider.nextPage()
          .pipe(take(1))
          .subscribe(explore => {
            console.log('Explore!', explore);
            infiniteScrollEvent.target.complete();

            // this.explore$ = this.exploreProvider.explore$;


            resolve();
          });

      });
    }
    return Promise.resolve();
  }


  openQr(){
    alert("COMING SOON")
  }



  ionViewDidEnter() {

    
    // Initialize
    this.searchUser = '';
    // Get all users.
    this.dataProvider.getUsers().query.once("value", ((accounts) => {
      this.accounts = Object.values(accounts.val())

      console.log(accounts)
      this.dataProvider.getCurrentUser().subscribe((account: any) => {
        console.log('excludes', account);
        // Add own userId as exludedIds.
        this.excludedIds = [];
        this.account = account;
        // if (this.excludedIds.indexOf(account.userId) == -1) {
        //   this.excludedIds.push(account.userId);
        // }
        // Get friends which will be filtered out from the list using searchFilter pipe pipes/search.ts.
        if (account.friends) {
          account.friends.forEach(friend => {

            if (this.excludedIds.indexOf(friend) == -1) {
              this.excludedIds.push(friend);
            }
          });
        }

        //Get Following Users
        this.following = [];
        if (account.following) {
          this.following = account.following;
        }

  
      });


    })
    );
  }



  // Get the status of the user in relation to the logged in user.
  getStatus(user) {
    // Returns:
    // 0 when user can be requested as friend.
    // 1 when a friend request was already sent to this user.
    // 2 when this user has a pending friend request.
    // 3 when this user are being followed yet;
  
    if (this.following) {
      for (var i = 0; i < this.following.length; i++) {
        if (this.following[i] == user.userId) {
          return 3;
        }
      }
    }
    return 0;
  }

  //Follow User
  follow(user) {
    console.log(user)
    this.firebaseProvider.followUser(user.userId);
  }

  //unfollow User
  unfollow(user) {
    this.firebaseProvider.unfollowUser(user.userId);
  }

  // View user.
  viewUser(userId) {
    console.log(userId);
    if(userId == this.firebaseProvider.getCurrentUserId()){
      this.navCtrl.navigateForward('tabs/profile');
    }else{
      this.navCtrl.navigateForward('tabs/user-info/'+userId);
    }
  }

  isCurrentUser(userId){
    return this.firebaseProvider.getCurrentUserId() == userId;
  }

  
}
