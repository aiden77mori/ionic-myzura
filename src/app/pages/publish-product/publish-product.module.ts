import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PublishProductPage } from './publish-product';
import { Routes, RouterModule } from '@angular/router';
import { StarRatingModule } from 'ionic5-star-rating';
import { ProductDetailsComponentsModule } from 'src/app/components/product-details.component.module';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: PublishProductPage,
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
  declarations: [PublishProductPage]
})
export class PublishProductPageModule {}
