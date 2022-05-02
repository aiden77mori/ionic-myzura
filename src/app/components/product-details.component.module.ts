import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';
import { ProductComponent } from './product/product.component';
import { InnerhomeComponent } from './innerhome/innerhome.component';
import { ProductTagComponent } from './product-tag/product-tag';
import { StarRatingModule } from 'ionic5-star-rating';
import { TagsModalComponent } from './tags-modal/tags-modal';
import { PostGridComponent } from './post-grid/post-grid.component';
import { PipesModule } from '../pipes/pipes.module';
import { PostCardComponent } from './post-card/post-card.component';
import { PopoverComponent } from './popover/popover.component';
import { ClosetComponent } from './closet/closet';
import { ClosetCatComponent } from './closet-cat/closet-cat';
import { BrowserService } from '../services/browser.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    StarRatingModule,
    PipesModule


  ],
  declarations: [
    PostCardComponent,
    PopoverComponent,
    ProductComponent,
    InnerhomeComponent,
    ProductTagComponent,
    ClosetCatComponent,
    ClosetComponent,
    TagsModalComponent,
    PostGridComponent

  ],
  exports: [
    PostCardComponent,
    PopoverComponent,
    ProductComponent,
    InnerhomeComponent,
    ProductTagComponent,
    ClosetCatComponent,
    ClosetComponent,
    TagsModalComponent,
    PostGridComponent
  
  ],
  providers:[BrowserService]

})
export class ProductDetailsComponentsModule {}
