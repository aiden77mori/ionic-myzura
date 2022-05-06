import { Component, Input } from '@angular/core';
import * as firebase from 'firebase';
import { ModalController, NavController } from '@ionic/angular';
import { FirebaseProvider } from '../../../services/firebase.provider';
import { DataProvider } from '../../../services/data.provider';
import { TranslateProvider } from '../../../services/translate.service';
import { GlobalDataService } from '../../../services/global.data.service';
import { ActivatedRoute } from '@angular/router';
import { ProductsFilterProvider } from 'src/app/services/providers/products.filter.provider';

@Component({
  selector: 'page-filters',
  templateUrl: 'filters.html',
  styleUrls: ['filters.scss']
})
export class FiltersPage {
  // @Input() postKey: string;
  filterType="category";
  // sel_gender='';
  sel_price:any={upper:800, lower:0}
  filter_subcategory:any=[];
  
  // categoryList:any[]
  logolist:any[]

colors= [ "red", "yellow" ,"blue", "brown", "orange", "green", "violet", "black", "pink", "white", "grey", "beige"]
color=""
searchBrand =""


  @Input() outputFilters

  constructor(
    public firebaseProvider: FirebaseProvider,
    public dataProvider: DataProvider,
    public translate: TranslateProvider,
    public navCtrl: NavController,
    private modalController: ModalController,
    private globalData:  GlobalDataService,
    public productsFilterProvider: ProductsFilterProvider,

    public modalCtrl: ModalController) {

      
      this.globalData.BRANDS().then(brands=>{
        this.logolist = brands.sort(function(a, b) {
              var textA = a.name.toUpperCase();
              var textB = b.name.toUpperCase();
              return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
          });
       })

 
      // console.log(this.postKey)
  }

  ngOnInit(){
    this.color = this.outputFilters.color
    console.log(this.outputFilters.gender)
    if(this.outputFilters.gender == ""){
      this.dataProvider.getCurrentUser().subscribe((user:any) => {
        let gender = user.userBody.gender
        if(gender == "male"){
          this.outputFilters.gender = "Male"
          
        }else{
          this.outputFilters.gender= "Female"
        }
      });
    }
 
  }
  ionViewDidEnter() {
  }

  genderChanged(event){
    //console.log(event.detail.value);
    this.outputFilters.gender=event.detail.value
  }

  onSearchChange(event) {
    console.log(event.detail.value);
    
  }



  sel_cat(i,type) {

    if (type==1){
      if (this.outputFilters.categoryList[i].status==true)
        this.outputFilters.categoryList[i].status=false;
      else if (this.outputFilters.categoryList[i].status==false)
        this.outputFilters.categoryList[i].status=true;
    }else if (type==2){
      if (this.logolist[i].status==true)
       this.logolist[i].status=false;
      else if (this.logolist[i].status==false)
        this.logolist[i].status=true;

    }

  }

  sel_col(color){
    if(this.color==color){
      this.color=""
    }else{
      this.color = color
    }
  }

  apply(){
    this.productsFilterProvider.destroy()

    this.outputFilters.reset = false

    this.outputFilters.categoryList.forEach(c=>{
      if(c.status){
        this.outputFilters.categories.push(c.value);
      }
    })
    this.logolist.forEach(l=>{
      if(l.status){
        this.outputFilters.brands.push(l.name);
      }
    })


    this.outputFilters.color = this.color
    // this.outputFilters.gender = this.sel_gender
    this.outputFilters.price = this.sel_price.lower+ " "+  this.sel_price.upper 
    console.log ("----------filter_result------");

    // this.filter_subcategory=[];

    // this.category_list.forEach((element) => {
    //   if (element.status=='enable')
    //      this.filter_subcategory.push(element.item_id);
    // });

    // console.log(this.filter_subcategory);
    // var data={
    //   'filter_subcategory':JSON.stringify(this.filter_subcategory)
    // }

    this.modalController.dismiss(this.outputFilters);
  }

  reset(){

    this.productsFilterProvider.destroy()
    this.outputFilters.categories = []
    this.outputFilters.brands = []
    this.outputFilters.categoryList.forEach(c=>{
      c.status = false
      
    })
    this.logolist.forEach(l=>{
      l.status = false
    })
    this.color = ""
    this.outputFilters.reset = true
    this.outputFilters.color = this.color
    this.outputFilters.price =  this.sel_price.lower+ " "+  this.sel_price.upper 
    console.log ("----------filter_result------");

    // this.filter_subcategory=[];

    // this.category_list.forEach((element) => {
    //   if (element.status=='enable')
    //      this.filter_subcategory.push(element.item_id);
    // });

    // console.log(this.filter_subcategory);
    // var data={
    //   'filter_subcategory':JSON.stringify(this.filter_subcategory)
    // }

    this.modalController.dismiss(this.outputFilters);
  }

  dismiss() {
    this.modalController.dismiss(this.outputFilters);
  }

  back() {
    this.navCtrl.back();
  }

  onClickMore(){
    this.navCtrl.navigateForward('tabs/brands');
  }
}
