import { Injectable } from '@angular/core';
import { DataProvider } from './data.provider';

@Injectable({
  providedIn: 'root'
})
export class MyZuraClothingSizesService {

    sizes=[]
    constructor(
        private dataProvider: DataProvider
    ) { }
  


    getSizes(brand, gender, continent,category){
        return new Promise((resolve, reject)=>{
            this.dataProvider.getSizesByUserInfo(brand.toLowerCase(), gender.toUpperCase(), continent.toUpperCase(), category.toLowerCase() ).once('value',async (data:any)=>{
                data = data.val()
                resolve(data)
              })
        })
    }

  



}
