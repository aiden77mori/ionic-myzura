import { Component, ViewChild, OnInit } from '@angular/core';
import { IonContent, LoadingController, NavController } from '@ionic/angular';
import { FilterService } from "../../util/filterservice";

import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DataProvider } from 'src/app/services/data.provider';
import { LoadingProvider } from 'src/app/services/loading.provider';
import { StoryService } from 'src/app/services/story.service';
import { TranslateProvider } from 'src/app/services/translate.service';


@Component({
  selector: 'page-show-photo',
  templateUrl: 'show-photo.html',
  styleUrls: ['show-photo.scss']
})
export class ShowPhotoPage implements OnInit {

  filter: any;
  filters = [
    { name: "normal", class: "normal", filter: "" },
    { name: "clarendon", class: "clarendon", filter: "contrast(1.2) saturate(1.35)" },
    { name: "gingham", class: "gingham", filter: "brightness(1.05) hue-rotate(-10deg)" },
    { name: "moon", class: "moon", filter: "grayscale(1) contrast(1.1) brightness(1.1)" },
    { name: "lark", class: "lark", filter: "contrast(.9)" },
    { name: "reyes", class: "reyes", filter: "sepia(.22) brightness(1.1) contrast(.85) saturate(.75)" },
    { name: "slumber", class: "slumber", filter: "saturate(.66) brightness(1.05)" },
    { name: "aden", class: "aden", filter: "hue-rotate(-20deg) contrast(.9) saturate(.85) brightness(1.2)" },
    { name: "perpetua", class: "perpetua", filter: "" },
    { name: "mayfair", class: "mayfair", filter: "contrast(1.1) saturate(1.1)" },
    { name: "rise", class: "rise", filter: "brightness(1.05) sepia(.2) contrast(.9) saturate(.9) " },
    { name: "hudson", class: "hudson", filter: "brightness(1.2) contrast(.9) saturate(1.1)" },
    { name: "valencia", class: "valencia", filter: "contrast(1.08) brightness(1.08) sepia(0.08)" },
    { name: "xpro2", class: "xpro2", filter: "sepia(.3)" },
    { name: "willow", class: "willow", filter: "grayscale(.5) contrast(.95) brightness(.9)" },
    { name: "lofi", class: "lofi", filter: "saturate(1.1) contrast(1.5)" },
    { name: "inkwell", class: "inkwell", filter: "sepia(.3) contrast(1.1) brightness(1.1) grayscale(1)" },
    { name: "nashville", class: "nashville", filter: "sepia(.2) contrast(1.2) brightness(1.05) saturate(1.2)" },
    { name: "stinson", class: "stinson", filter: "contrast(0.75) saturate(0.85) brightness(1.15)" },
    { name: "earlybird", class: "earlybird", filter: "contrast(.9) sepia(.2)" },
    { name: "brannan", class: "brannan", filter: "sepia(0.5) contrast(1.4)" },
    { name: "toaster", class: "toaster", filter: "contrast(1.5) brightness(.9)" },
    { name: "walden", class: "walden", filter: "brightness(1.1) hue-rotate(-10deg) sepia(.3) saturate(1.6)" },
    { name: "1997", class: "_1977", filter: " contrast(1.1) brightness(1.1) saturate(1.3)" },
    { name: "kelvin", class: "kelvin", filter: "" },
    { name: "maven", class: "maven", filter: "sepia(.25) brightness(.95) contrast(.95) saturate(1.5)" },
    { name: "brooklyn", class: "brooklyn", filter: "contrast(.9) brightness(1.1)" },
  ];

  customFilters = [
    { name: "brightness", filter: "brightness", icon: "sunny-outline" ,val:0},
    { name: "contrast", filter: "contrast", icon: "contrast-outline" ,val:0},
    { name: "saturation", filter: "saturate", icon: "water-outline",val:0 },
    { name: "fade", filter: "opacity", icon: "cloud-outline",val:0 },
    // {name: "shadows", icon: "ios-star-half-outline"},
  ];

  slideOpts = {
    slidesPerView: 4,

    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    }
  };

  src: string;
  user: any;
  story: boolean = false;
  mode = "filter"
  tempFlter = "";
  imageStyleFilter = "";
  brightness = 0;
  contrast = 0;
  saturation = 0;
  fade = 0;
  actualView = "default";
  title: string;


  @ViewChild(IonContent, { static: false })
  content: IonContent;

  @ViewChild("imageFilter", { static: false })
  image: HTMLImageElement;
  private hasEvent: any;

  private backupFilter = "";
  private backupVariable: any;

  constructor(
    private router: Router, private location: Location, private filterService: FilterService,
    public translate: TranslateProvider,
    public navCtrl: NavController,

    private loadingCtrl : LoadingController,
    public dataProvider: DataProvider, public loadingProvider: LoadingProvider, public storyService: StoryService) {
    this.filterService.init()
    this.filter = this.filters[0]

   this. customFilters = [
      { name: this.translate.get("show.photo.page.brightness"), filter: "brightness", icon: "sunny-outline", val:1},
      { name: this.translate.get("show.photo.page.contrast"), filter: "contrast", icon: "contrast-outline",val:1  },
      { name: this.translate.get("show.photo.page.saturation"), filter: "saturate", icon: "water-outline",val:1 },
      { name: this.translate.get("show.photo.page.fade"), filter: "opacity", icon: "cloud-outline",val:1  },
      // {name: "shadows", icon: "ios-star-half-outline"},
    ];
  }

  async ngOnInit() {
    const state: any = (window as any).history.state;
    console.log(state);
    let { src, story } = state;
    if (story) this.story = story;
    this.src = src;
    this.actualView = 'default';
  }

  ionViewWillEnter() {
    this.dataProvider.getCurrentUser().subscribe((user) => {
      this.user = <any>user;
    });
  }

  changeView(newView, title) {
    this.backupFilter = this.getCurrentFilter();
    this.backupVariable = this[newView];
    console.log(newView)
    setTimeout(() => {
      this.actualView = newView;
      this.title = title;
      // this.content.resize();      
    }, 1);

  }

  // Our tracking function
  public trackByFunction(index, item) {
    // here we will provide the item id
    if (!item) return null;

    return item.name;

  }

  back() {

    if (this.isCustomFilter()) {

      this.changeView("edit", "");

    } else {
      this.location.back();
    }


  }

  press($event) {

    let image = (<HTMLImageElement>document.getElementById("imageFilter"))
    this.imageStyleFilter = image.style.filter;
    image.style.filter = ""
    this.tempFlter = this.filter;

    this.filter = "";
    console.log("press", $event)
    this.hasEvent = true;
  }

  end() {

    if (this.hasEvent) {
      this.filter = this.tempFlter;
      let image = (<HTMLImageElement>document.getElementById("imageFilter"))
      image.style.filter = this.imageStyleFilter;

      console.log("end")
      this.hasEvent = false;
    }

  }

  async next() {
    let loading = await this.loadingCtrl.create({
      spinner: 'circles'
    });
    loading.present();
    console.log("next");

    let c = (<HTMLDivElement>document.getElementById("imageFilter3"));
    var canvas = (<HTMLCanvasElement>document.getElementById("imageFilter2"));

    let img = this.findImage();

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    let self = this;


    try {
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      let image = canvas.toDataURL("image/jpeg");      
      this.router.navigateByUrl('tabs/publish', { state: { image: image } });
      loading.dismiss();  
    }catch (error) {
      loading.dismiss();
    }
    // try {
        
    //   (<any>window).rasterizeHTML.drawHTML(c.innerHTML, canvas).then(function success(renderResult) {

    //     // let image = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");      
    //     let image = canvas.toDataURL("image/jpeg");      

    //     loading.dismiss();  
    //     // if (self.story) {        
    //     //   self.storyService.addStory({
    //     //     image: image,
    //     //     userName: self.user.name,
    //     //     userPhoto: self.user.profilePic
    //     //   });
    //     //   self.navCtrl.navigateForward('tabs/reviews', { replaceUrl: true });
  
    //     // } else {
    //     // }
    //     self.navCtrl.navigateForward('tabs/publish', { state: { image: image } });

    //   }, function error(e) {
    //     console.log(e);
    //     loading.dismiss();
    //   });
    // } catch (error) {
    //   loading.dismiss();

    //   let image = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");      

    //   this.router.navigateByUrl('tabs/publish', { state: { image: image } });

    // }

  }


  isCustomFilter() {
    return this.customFilters.findIndex(item => this.actualView == item.name) > -1;
  }


  isFilterUsed(filter) {
    return this.filterService.getCustomFilters().findIndex(item => item == filter) > -1
  }


  changeSegment(evt: any, customFilter: boolean = false) {
    const { value } = evt.target;
    this.actualView = value;
  }


  changeFilter(newFilter) {
    this.filter = newFilter;
    let currentFilter = this.getCurrentFilter();
    let filter = this.filterService.getStyleFilter(currentFilter, newFilter.filter, false);
    this.applyFilter(filter);
  }

  changeFilterManual(filterType) {
    
    this.customFilters[filterType].val = parseFloat(this.customFilters[filterType].val.toFixed(2))
      this.filter = this.customFilters[filterType];
      let currentFilter = this.getCurrentFilter();
      console.log(this.customFilters[filterType].filter + '('+ this.customFilters[filterType].val + ')')
      let filter = this.filterService.getStyleFilter(currentFilter,this.customFilters[filterType].filter  + '('+ this.customFilters[filterType].val + ')', false);
      this.applyFilter(filter);
  }

  applyFilter(filter: string) {
    let image = this.findImage();
    image.style.filter = filter;
  }

  findImage(): HTMLImageElement {
    return (<HTMLImageElement>document.getElementById("imageFilter"));
  };

  getCurrentFilter() {
    let currentFilter = "";
    let image = this.findImage();
    if (image.style) {
      currentFilter = image.style.filter;
    }

    return currentFilter;
  }


  cancel(evt) {

    this.applyFilter(this.backupFilter);

    if (!this.filterService.areadyExistsChange(this.actualView, this.backupFilter)) {
      this[this.actualView] = null;
      this.filterService.removeCustomFilter(this.actualView, this.backupFilter);
    } else {
      this[this.actualView] = this.backupVariable;
    }

    this.backupFilter = "";
    this.actualView = 'edit';


  }

  done(evt) {
    this.actualView = 'edit';
  }


}
