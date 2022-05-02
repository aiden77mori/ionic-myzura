import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, NavController, AlertController } from '@ionic/angular';
import { DataProvider } from './data.provider';
// import { DataService } from './data.service';

import { TranslateProvider } from './translate.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalDataService {
  // public BRANDS = []
  constructor(
      public translate: TranslateProvider,
      public dataProvider: DataProvider
) { 


  // this.BRANDS.forEach((b,i)=>{
  //   this.BRANDS[i].name = this.capitalize(b.name)})
}
  
  public CATEGORIES:any[]=[
    {name:  this.translate.get("filters.accessories.cat"), value:"Accessories", image:'assets/imgs/discover/1.png', status:false},
    {name:  this.translate.get("filters.shoes.cat"),value:"Shoes", image:'assets/imgs/discover/2.png', status:false},
    {name:  this.translate.get("filters.trainers.cat"),value:"Trainers", image:'assets/imgs/discover/2.png', status:false},
    {name:  this.translate.get("filters.tshirts.cat"),value:"T-Shirts", image:'assets/imgs/discover/3.png',status:false },
    {name:  this.translate.get("filters.shirts.cat"),value:"Shirts", image:'assets/imgs/discover/4.png',status:false },
    {name:  this.translate.get("filters.shorts.cat"),value:"Shorts", image:'assets/imgs/discover/4.png',status:false },
    {name:  this.translate.get("filters.trousers.cat"),value:"Trousers", image:'assets/imgs/discover/5.png',status:false },
    {name:  this.translate.get("filters.jeans.cat"),value:"Jeans", image:'assets/imgs/discover/6.png',status:false },
    {name:  this.translate.get("filters.coats.cat"),value:"Coats", image:'assets/imgs/discover/7.png',status:false },
    {name:  this.translate.get("filters.sportswear.cat"),value:"SportsWear", image:'assets/imgs/discover/8.png',status:false },
    {name:  this.translate.get("filters.leggings.cat"),value:"Leggings", image:'assets/imgs/discover/9.png',status:false },
    {name:  this.translate.get("filters.skirts.cat"),value:"Skirts", image:'assets/imgs/discover/10.png',status:false },   
    {name:  this.translate.get("filters.dresses.cat"),value:"Dresses", image:'assets/imgs/discover/10.png',status:false },  
    {name:  this.translate.get("filters.underwear.cat"),value:"Underwear", image:'assets/imgs/discover/10.png',status:false },   
    {name:  this.translate.get("filters.jumpers.cat"),value:"Jumpers", image:'assets/imgs/discover/10.png',status:false },   
    {name:  this.translate.get("filters.formalwear.cat"),value:"FormalWear", image:'assets/imgs/discover/10.png',status:false },   
    {name:  this.translate.get("filters.glasses.cat"),value:"Glasses", image:'assets/imgs/discover/10.png',status:false },   
    {name:  this.translate.get("filters.jewerly.cat"),value:"Jewerly", image:'assets/imgs/discover/10.png',status:false },   
    {name:  this.translate.get("filters.hats.cat"),value:"Hats", image:'assets/imgs/discover/10.png',status:false },   
    {name:  this.translate.get("filters.windbreakers.cat"),value:"Windbreakers", image:'assets/imgs/discover/10.png',status:false },   
    {name:  this.translate.get("filters.sweatshirts.cat"),value:"Sweatshirts", image:'assets/imgs/discover/10.png',status:false },   
    {name:  this.translate.get("filters.sunglasses.cat"),value:"Sunglasses", image:'assets/imgs/discover/10.png',status:false },   
    {name:  this.translate.get("filters.watches.cat"),value:"Watches", image:'assets/imgs/discover/10.png',status:false },   
    {name:  this.translate.get("filters.swimsuits.cat"),value:"Swimsuits", image:'assets/imgs/discover/10.png',status:false },   
    {name:  this.translate.get("filters.handbags.cat"),value:"Handbags", image:'assets/imgs/discover/10.png',status:false },   
    {name:  this.translate.get("filters.travelbags.cat"),value:"TravelBags", image:'assets/imgs/discover/10.png',status:false },   
    {name:  this.translate.get("filters.sportpants.cat"),value:"SportPants", image:'assets/imgs/discover/10.png',status:false },   
    {name:  this.translate.get("filters.pyjamas.cat"),value:"Pyjamas", image:'assets/imgs/discover/10.png',status:false },   
    {name:  this.translate.get("filters.socks.cat"),value:"Socks", image:'assets/imgs/discover/10.png',status:false },   
];
capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
BRANDS(){
  return new Promise<any[]>((resolve, reject) => {
    let BRANDS = []
    this.dataProvider.getBrandNames().query.once("value", data=>{
      console.log(data.val())
      let keys = Object.keys(data.val())
      let vls = data.val()
      
      if(vls){
        keys.forEach(key => {
          BRANDS.push(
            {
              value: key,
              name: vls[key].publicName ,
              image:'assets/imgs/logo/1.png',
              link: vls[key].link , 
              status:false //vls[key].isVisible 
            }
          )
        });
  
      }
      resolve(BRANDS)
    })
  })
}
  // public BRANDS:any[]=[
  //   {name: 'zara',image:'assets/imgs/logo/1.png',link: "https://www.zara.com/es/", status:false },
  //   {name: 'mango',image:'assets/imgs/logo/1.png',link: "https://shop.mango.com/es/", status:false },
  //   {name: 'hm',image:'assets/imgs/logo/1.png',link: "https://www2.hm.com/es_es/index.html",status:false },
  //   {name: 'bershka',image:'assets/imgs/logo/1.png', link: "https://www.bershka.com/es/",status:false },
  //   {name: 'stradivarius',image:'assets/imgs/logo/1.png',link: "https://www.stradivarius.com/es/",status:false },
  //   {name: 'nike',image:'assets/imgs/logo/1.png',link: "https://www.nike.com/es/",status:false },
  //   {name: 'adidas',image:'assets/imgs/logo/1.png',link: "https://www.adidas.es",status:false },
  //   {name: 'vans',image:'assets/imgs/logo/1.png',link: "https://www.vans.es",status:false },
  //   {name: 'converse',image:'assets/imgs/logo/1.png',link: "https://www.converse.com/es/go?lang=es_ES",status:false },
  //   {name: 'levi',image:'assets/imgs/logo/1.png',link: "https://www.levi.com/ES/es_ES/",status:false },
  //   {name: 'pullandbear',image:'assets/imgs/logo/1.png',link: "https://www.pullandbear.com/es/",status:false },
  //   {name: 'pimkie',image:'assets/imgs/logo/1.png',link: "https://www.pimkie.es",status:false },
  //   {name: 'marypaz',image:'assets/imgs/logo/1.png',link: "https://www.marypaz.com/es_es",status:false },
  //   {name: 'shein',image:'assets/imgs/logo/1.png',link: "https://es.shein.com",status:false },
  //   {name: 'ray-ban',image:'assets/imgs/logo/1.png',link: "https://www.ray-ban.com/spain",status:false },
  //   {name: 'hawkersco',image:'assets/imgs/logo/1.png',link: "https://beta.hawkersco.com",status:false },
  //   {name: 'bimbaylola',image:'assets/imgs/logo/1.png',link: "https://www.bimbaylola.com/es_es/",status:false },
  //   {name: 'calzedonia',image:'assets/imgs/logo/1.png',link: "https://www.calzedonia.com/es/",status:false },
  //   {name: 'calvinklein',image:'assets/imgs/logo/1.png',link: "https://www.calvinklein.es",status:false },
  //   {name: 'womensecret',image:'assets/imgs/logo/1.png',link: "https://womensecret.com/es/es",status:false },
  //   {name: 'ralphlauren',image:'assets/imgs/logo/1.png',link: "https://www.ralphlauren.es",status:false },
  //   {name: 'tommy',image:'assets/imgs/logo/1.png',link: "https://es.tommy.com",status:false },
  //   {name: 'massimodutti',image:'assets/imgs/logo/1.png',link: "https://www.massimodutti.com/es/",status:false },
  //   {name: 'reebok',image:'assets/imgs/logo/1.png',link: "https://www.reebok.es",status:false },
  //   {name: 'underarmour',image:'assets/imgs/logo/1.png',link: "https://www.underarmour.es/es-es/",status:false },
  //   {name: 'puma',image:'assets/imgs/logo/1.png',link: "https://eu.puma.com/es/es/home",status:false },
  //   {name: 'c-and-a',image:'assets/imgs/logo/1.png',link: "https://www.c-and-a.com/es/es/shop",status:false },
  //   {name: 'uniqlo',image:'assets/imgs/logo/1.png',link: "https://www.uniqlo.com/es/es/home",status:false },
  //   {name: 'jackjones',image:'assets/imgs/logo/1.png',link: "https://www.jackjones.com/es/es/home",status:false },
  //   {name: 'celio',image:'assets/imgs/logo/1.png',link: "https://www.celio.es",status:false },
  //   {name: 'diesel',image:'assets/imgs/logo/1.png',link: "https://es.diesel.com/es/",status:false },
  //   {name: 'pepejeans',image:'assets/imgs/logo/1.png',link: "https://www.pepejeans.com/es_es/home",status:false },
  //   {name: 'forever21',image:'assets/imgs/logo/1.png',link: "https://forever21.com.mx",status:false }
  //   ]
}
