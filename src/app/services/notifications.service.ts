import { Injectable } from '@angular/core';
import { FirebaseProvider } from './firebase.provider';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Platform, ToastController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class NotificationsService {

  fcmApi = "https://3of1qsst4f.execute-api.eu-west-1.amazonaws.com/default/fcm-myzura-api"
  constructor(
    private firebaseX: FirebaseX,
    public firebaseProvider: FirebaseProvider,
    public httpClient: HttpClient,
    public toastController: ToastController,
    public platform : Platform

  ) {

   }



  setToken(userId){
    //token to be configured
      this.firebaseX.getToken().then(token => {
        console.log(`The token is ${token}`)
        this.firebaseProvider.dataProvider.getUser(userId).update({token: token})
      }).catch(error => {
        console.error('Error getting token', error)
      });

  }


  getToken(userId){
    return new Promise((resolve, reject)=>{
      this.firebaseProvider.dataProvider.getUser(userId).query.once("value", (res:any)=>{
        res=res.val()
        resolve(res.token)
      })
    })
  }
  sendNotification(params:any){
    this.getToken(params.userId).then((token:any)=>{
      let body =
      JSON.stringify({
        body : {
        "to":token,
        "notification" : {
          "sound" : "default",
          "body" :  `${params.username} ${params.action} ${params.body}`,
          "title" : "MyZura",
          "content_available" : true,
          "priority" : "high"
        },
        "data" : {
          "sound" : "default",
          "body" :  `${params.username} ${params.action} ${params.body}`,
          "title" : "MyZura",
          "content_available" : true,
          "priority" : "high"
        }
      }})
    // let  httpOptions = {
    //   headers: new HttpHeaders({
    //   "Content-Type": "application/json",
    //   "Authorization" : "key=AAAAi8nXrNU:APA91bEHhssio3SGvLmw27UBE1nNchcEKyn_HuEn80GFj-66b81eBQUFEw1SihgIQLWFLeb8KUvy4407GELzC0LkbJQl-Kn_4WJQp9gdKwN13Mbu0y626VONmiFovK9E9ImUXvHSfCnr" ,
    //   "Access-Control-Allow-Origin" : "*",
    //   })};

    console.log({
      date: Date.now(),
      type: params.type,
      username: params.username,
      body: `${params.username} ${params.action} ${params.body}`,
      senderId: params.senderId,
      postId: params.postId

    })
    this.httpClient
      .post(this.fcmApi, body)
      .toPromise()
      .then(res=>{
        this.firebaseProvider.dataProvider.getNotifications(params.userId).push({
          date: Date.now(),
          type: params.type,
          username: params.username,
          body: `${params.username} ${params.action} ${params.body}`,
          senderId: params.senderId,
          postId: params.postId
        })
      })
      .catch(this.handleError);

    })



//Authorization =

  }



  testNotifications(params){

    this.firebaseProvider.dataProvider.getNotifications(params.userId).push({
      date: Date.now(),
      type: params.type,
      username: params.username,
      title: params.title,
      body: params.body,
      senderId: params.senderId
    })
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 3000
    });
    toast.present();
  }

   notificationSetup(userId) {
    this.firebaseX.hasPermission().then(per=>{
      if(!per){
        this.firebaseX.grantPermission().then(res=>{

          this.setToken(userId);
        })
      }else{
        this.setToken(userId);
      }


    })

    this.firebaseX.onMessageReceived().subscribe(
      (msg) => {
        if (this.platform.is('ios')) {
          this.presentToast(msg.aps.alert);
        } else {
          this.presentToast(msg.body);
        }
      });
  }

private extractData(res: Response
  ) {
    console.log(res)
  // let body = res.json();
  return res || {};

}

  private extractDataString(res: Response
    ) {
    let body = res;
    return body || {};

  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
