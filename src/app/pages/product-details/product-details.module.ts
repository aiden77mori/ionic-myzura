import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ProductDetailsPage } from './product-details';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProductDetailsComponentsModule } from 'src/app/components/product-details.component.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { RelatedProductsProvider } from 'src/app/services/providers/related.products.provider';

const routes: Routes = [
  {
    path: '',
    component: ProductDetailsPage,
  }
];

@NgModule({
  imports: [
    CommonModule,
    PipesModule,
    FormsModule,
    // ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ProductDetailsComponentsModule,

    TranslateModule.forChild()
  ],
  declarations: [ProductDetailsPage],
  providers:[RelatedProductsProvider]
})
export class ProductDetailsPageModule {}
