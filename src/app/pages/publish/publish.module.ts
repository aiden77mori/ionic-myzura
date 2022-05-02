import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PublishPage } from './publish';
import { Routes, RouterModule } from '@angular/router';
import { StarRatingModule } from 'ionic5-star-rating';
import { ProductDetailsComponentsModule } from 'src/app/components/product-details.component.module';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: PublishPage,
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    StarRatingModule,

    RouterModule.forChild(routes),
    ProductDetailsComponentsModule,
    TranslateModule.forChild(),
  ],
  declarations: [PublishPage]
})
export class PublishPageModule {}
