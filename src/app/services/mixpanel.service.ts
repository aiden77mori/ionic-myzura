import { Injectable } from '@angular/core';
import { DataProvider } from './data.provider';
import { Mixpanel } from '@ionic-native/mixpanel/ngx';

@Injectable({
  providedIn: 'root'
})
export class MixpanelService {

    apiToken = "1762995e0db8789120cdd38123000705"
  
    constructor(
        private mixpanel: Mixpanel
        ){
        this.mixpanel.init(this.apiToken)
        .then((res)=>{console.log(res)})
        .catch((err)=>{console.log(err)});
        
    }

    setUserId(userId){
        this.mixpanel.alias('new_id', userId);
    }



    track(info, data){
        this.mixpanel.track(info, data);
    }

  



}
