import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MyZuraApiService {
 
    bodyMeasuresAPI = "https://kr9djr6jef.execute-api.eu-west-1.amazonaws.com/default/BodyMeasuresPrediction"
    bodySizesAPI = "https://8pt9h9h4r4.execute-api.eu-west-1.amazonaws.com/Prod/compute/"
    kmeansAPI = "https://bznd1rrmq2.execute-api.eu-west-1.amazonaws.com/default/UserBodyTypeClassification"
    clothingSizesAPI  ="https://nbmfcxyfi5.execute-api.eu-west-1.amazonaws.com/default/ComputeUserSizes"
    marketplaceRecommendationAPI ="https://cxwrbelshk.execute-api.eu-west-1.amazonaws.com/default/ComputeProductFeed"
    closetRecommendationAPI ="https://pv7wxrf7h6.execute-api.eu-west-1.amazonaws.com/default/StoreDefaultClosetProducts"
    exploreRecommendationAPI ="https://c9d53tgwqd.execute-api.eu-west-1.amazonaws.com/default/ComputeExploreFeed"
    makePostThumbs = 'https://9l61a71phc.execute-api.eu-west-1.amazonaws.com/default/addPhotosToPost'
    filterApi = "https://3z1tk759gg.execute-api.eu-west-1.amazonaws.com/default/UserSearchFilter"
    findProduct = "https://z90f9lzzsk.execute-api.eu-west-1.amazonaws.com/default/findProduct"
    addProduct = "https://ykjv2xko76.execute-api.eu-west-1.amazonaws.com/default/addProduct"
    bodyCategory = "https://9fj200ksu2.execute-api.eu-west-1.amazonaws.com/default/apiBodyCategory"
    searchFilterApi = "https://j1ghjaorgk.execute-api.eu-west-1.amazonaws.com/default/FilterProductByKeyword"
    metTagsApi = "https://f6ekzspydi.execute-api.eu-west-1.amazonaws.com/default/getMetaTags"
    localProductsApi = "https://shtfqslt71.execute-api.eu-west-1.amazonaws.com/default/ComputeLocalProducts"
    addPhotosToProfileAPI="https://ro7z78lm5h.execute-api.eu-west-1.amazonaws.com/default/addPhotosToProfile"

    imageToBase64API= "https://6izwcn3ra9.execute-api.eu-west-1.amazonaws.com/default/image-to-base64"
    getFootSizeByUserInput = 'https://jnam19qsr4.execute-api.eu-west-1.amazonaws.com/default/GetFootSizeByUserInput'

    removeBgProductImageAPI="https://mcth3qhe59.execute-api.eu-west-1.amazonaws.com/default/ImageBGRemove"

    addPhotosToProductAPI = "https://8m6lrggvee.execute-api.eu-west-1.amazonaws.com/default/addPhotosToProduct"
    constructor(
      public httpClient: HttpClient
    ) { }
  


   findProductAPI(data){
      let body = JSON.stringify(data);
  
      return this.httpClient
        .post(this.findProduct, body)
        .toPromise()
  
    }

    addPhotosToProduct(data){
      let body = JSON.stringify(data);
  
      return this.httpClient
        .post(this.addPhotosToProductAPI, body)
        .toPromise()
  
    }


    imageToBase64(data){
      let body = JSON.stringify(data);
  
      return this.httpClient
        .post(this.imageToBase64API, body)
        .toPromise()
  
    }

    imageBGRemove(data){
      let body = JSON.stringify(data);
  
      return this.httpClient
        .post(this.removeBgProductImageAPI, body)
        .toPromise()
  
    }

    getBodyCategoryApi(data){

        return new Promise((resolve, reject) => {
          try {
            console.log(data)
            let body = JSON.stringify(data);
        
            this.httpClient
              .post(this.bodyCategory, body)
              .toPromise().then(res => {resolve(res)})
              .catch(res => {resolve("")})
          } catch (error) {
            resolve("")
          }
        })  
    }
    getBodyCategory(data){
      return new Promise((resolve, reject) => {
        try {
          this.getBodyCategoryApi(data).then((res)=>{
            resolve(res)
          })
        } catch (error) {
          resolve("")
        }
      })  
    }
    addProductAPI(data){
      console.log(data)
      let body = JSON.stringify(data);
  
      return this.httpClient
        .post(this.addProduct, body)
        .toPromise()
  
    }
    addProductLoop(data){
      try {
        this.addProductAPI(data)
       } catch (error) {
         try {
           this.addProductAPI(data)
          } catch (error) {
            try {
              this.addProductAPI(data)
             } catch (error) {
               try {
                 this.addProductAPI(data)
                } catch (error) {
                  this.addProductAPI(data)
                }
             }
          }
       }
  
    }
  getProductsByFilter(filter){
    let body = JSON.stringify(filter);

    return this.httpClient
      .post(this.filterApi, body)
      .toPromise()

  }
  getProductsBySearchFilter(filter){
    let body = JSON.stringify(filter);

    return this.httpClient
      .post(this.searchFilterApi, body)
      .toPromise()

  }

  getLocalProducts(params){
    let body = JSON.stringify(params);

    return this.httpClient
      .post(this.localProductsApi, body)
      .toPromise()

  }
  getFootSizeByUserData(params){
    let body = JSON.stringify(params);

    return this.httpClient
      .post(this.getFootSizeByUserInput, body)
      .toPromise()

  }
  addPhotosToProfile(params){
    let body = JSON.stringify(params);

    return this.httpClient
      .post(this.addPhotosToProfileAPI, body)
      .toPromise()
  }

 postUserBodyMeasures(params:any): Promise<any> {
  params['chestType'] =  params['chestType'].toString()
  params['waistType'] =  params['waistType'].toString()
  params['hipType'] =params['hipType'].toString()

    params['age'] = params['age'].toString()
    params['bmi'] = params['bmi'].toString()
    params['bfp'] = params['bfp'].toString()
    params['bodyType'] = params['bodyType'].toString()
    params['height'] =  params['height'].toString()
    params['weight'] =  params['weight'].toString()
  let bodyData = params

  console.log(bodyData)
  let body = JSON.stringify(bodyData);
//  let  httpOptions = {
//     headers: new HttpHeaders({ 
//     "Content-Type": "application/json",
//     // "Authorization" : "Basic NmNkMjQ2MmJhODk4NGNiYTkyMjBmZGZiYTg0YTlhMjE6" ,
//     "Access-Control-Allow-Origin" : "*" 

//     })}; 
   
  return this.httpClient
      .post(this.bodyMeasuresAPI, body)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
}


postUserBodySizes(params:any): Promise<any> {
  
 
let body = JSON.stringify(params);
//  let  httpOptions = {
//     headers: new HttpHeaders({ 
//     "Content-Type": "application/json",
//     // "Authorization" : "Basic NmNkMjQ2MmJhODk4NGNiYTkyMjBmZGZiYTg0YTlhMjE6" ,
//     "Access-Control-Allow-Origin" : "*" 

//     })}; 

return this.httpClient
   .post(this.bodySizesAPI, body)
   .toPromise()
   .then(this.extractData)
   .catch(this.handleError);
}


makePostThumbsAPI(params:any): Promise<any> {
  
 
  let body = JSON.stringify(params);
  //  let  httpOptions = {
  //     headers: new HttpHeaders({ 
  //     "Content-Type": "application/json",
  //     // "Authorization" : "Basic NmNkMjQ2MmJhODk4NGNiYTkyMjBmZGZiYTg0YTlhMjE6" ,
  //     "Access-Control-Allow-Origin" : "*" 
  
  //     })}; 
  
  return this.httpClient
     .post(this.makePostThumbs, body)
     .toPromise()
     .then(this.extractData)
     .catch(this.handleError);
  }

generateUserClothingSizes(params:any): Promise<any> {
  
 
  let body = JSON.stringify(params);
  //  let  httpOptions = {
  //     headers: new HttpHeaders({ 
  //     "Content-Type": "application/json",
  //     // "Authorization" : "Basic NmNkMjQ2MmJhODk4NGNiYTkyMjBmZGZiYTg0YTlhMjE6" ,
  //     "Access-Control-Allow-Origin" : "*" 
  
  //     })}; 
  
  return this.httpClient
     .post(this.clothingSizesAPI, body)
     .toPromise()
     .then(this.extractData)
     .catch(this.handleError);
}



generateClosetRecommendations(params:any): Promise<any> {
  
 
  let body = JSON.stringify(params);
  //  let  httpOptions = {
  //     headers: new HttpHeaders({ 
  //     "Content-Type": "application/json",
  //     // "Authorization" : "Basic NmNkMjQ2MmJhODk4NGNiYTkyMjBmZGZiYTg0YTlhMjE6" ,
  //     "Access-Control-Allow-Origin" : "*" 
  
  //     })}; 
  
  return this.httpClient
     .post(this.closetRecommendationAPI, body)
     .toPromise()
     .then(this.extractData)
     .catch(this.handleError);
}
 

generateMarketplaceRecommendations(params:any): Promise<any> {
  
 
  let body = JSON.stringify(params);
  //  let  httpOptions = {
  //     headers: new HttpHeaders({ 
  //     "Content-Type": "application/json",
  //     // "Authorization" : "Basic NmNkMjQ2MmJhODk4NGNiYTkyMjBmZGZiYTg0YTlhMjE6" ,
  //     "Access-Control-Allow-Origin" : "*" 
  
  //     })}; 
  
  return this.httpClient
     .post(this.marketplaceRecommendationAPI, body)
     .toPromise()
     .then(this.extractData)
     .catch(this.handleError);
}
 

generateExploreRecommendations(params:any): Promise<any> {
  
 
  let body = JSON.stringify(params);
  //  let  httpOptions = {
  //     headers: new HttpHeaders({ 
  //     "Content-Type": "application/json",
  //     // "Authorization" : "Basic NmNkMjQ2MmJhODk4NGNiYTkyMjBmZGZiYTg0YTlhMjE6" ,
  //     "Access-Control-Allow-Origin" : "*" 
  
  //     })}; 
  
  return this.httpClient
     .post(this.exploreRecommendationAPI, body)
     .toPromise()
     .then(this.extractData)
     .catch(this.handleError);
}
postKmeans(params:any): Promise<any> {
  
 
  let body = JSON.stringify(params);
  //  let  httpOptions = {
  //     headers: new HttpHeaders({ 
  //     "Content-Type": "application/json",
  //     // "Authorization" : "Basic NmNkMjQ2MmJhODk4NGNiYTkyMjBmZGZiYTg0YTlhMjE6" ,
  //     "Access-Control-Allow-Origin" : "*" 
  
  //     })}; 
  
  return this.httpClient
     .post(this.kmeansAPI, body)
     .toPromise()
     .then(this.extractData)
     .catch(this.handleError);
  }
  

  getMetaTagsAPI(url:string): Promise<any> {
  
 

    let body = JSON.stringify({ 
      link:url
    });

    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type':  'application/json',
    //     'Authorization': 'Basic ' + btoa('hamza.diaz.house@gmail.com:x5cNyrWXeTN54yQtjoEX')
    //   })
    // };
    
    return this.httpClient
       .post(this.metTagsApi,body)
       .toPromise()
       .then(this.extractData)
       .catch(this.handleError);
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
