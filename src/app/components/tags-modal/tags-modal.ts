import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { DataProvider } from 'src/app/services/data.provider';
import { map, take } from 'rxjs/operators';


/**
 * This page show us user's friends posts 
 * and following users posts
 *
 */

@Component({
  selector: 'page-tags-modal',
  templateUrl: 'tags-modal.html',
  styleUrls: ['tags-modal.scss']
})
export class TagsModalComponent implements OnInit {

  @Input() taggedProducts:any;
  @Input() type:any;
  @Input() xPercent:any;
  @Input() yPercent:any;
  @Input() modal:any;
  closetData=[]
  search=''

  constructor(
    public modalCtrl: ModalController,
    public dataProvider: DataProvider,
    public navCtrl: NavController
    // public storyService: StoryService
    ) {

    
  }

  async ngOnInit(){
    // if(this.xPercent){
    //   this.taggedProducts['tagX']=this.xPercent
    //   this.taggedProducts['tagY']=this.yPercent
    //  }

    //DO IT ONCE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    
    await this.dataProvider.getCLoset().valueChanges().subscribe((data:any,)=>{
      this.closetData = []
      if(data){
       let dataAux:any = Object.values(data)
       dataAux = dataAux.reverse()
       dataAux.forEach(async product => {
        await this.dataProvider.getProductById(product.productId ).snapshotChanges().subscribe((snapshot)=>{
          console.log(snapshot)
          let productData ={}

          if(snapshot){
            snapshot.forEach(snap => {
              productData[snap.key] = snap.payload.val();
            });
            this.closetData.push(productData)
          }
        //  console.log((this.productData))
         })
      });

       
      }

    })
  }

 async  back() {
   await  this.modal.dismiss();
  }
  openProducts(){
    this.navCtrl.navigateForward('tabs/publish/marketplace');
  }

}
