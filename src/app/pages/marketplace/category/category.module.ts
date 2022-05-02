import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryPage } from './category';
import { Routes, RouterModule } from '@angular/router';
import { SearchPipeModule } from 'src/app/pipes/search.module';
import { TranslateModule } from '@ngx-translate/core';
import { ProductDetailsComponentsModule } from 'src/app/components/product-details.component.module';
import { CategoryResolver } from './category.resolver';
import { ProductsProvider } from 'src/app/services/providers/producs.provider';
import { WhishlistProvider } from 'src/app/services/providers/wishlist.provider';
import { ProductsFilterProvider } from 'src/app/services/providers/products.filter.provider';
import { LocalProductsProvider } from 'src/app/services/providers/localproducs.provider';

const routes: Routes = [
  {
    path: '',
    component: CategoryPage,
    // resolve: {
    //   data: MarketplaceResolver
    // }
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SearchPipeModule,
    TranslateModule.forChild(),
    ProductDetailsComponentsModule,SearchPipeModule

  ],
  declarations: [CategoryPage],
  providers:[ProductsProvider,WhishlistProvider, ProductsFilterProvider, LocalProductsProvider ]

})
export class CategoryPageModule {}
