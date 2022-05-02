import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WishlistPage } from './wishlist';
import { Routes, RouterModule } from '@angular/router';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { WhishlistProvider } from 'src/app/services/providers/wishlist.provider';
import { ProductDetailsComponentsModule } from 'src/app/components/product-details.component.module';
import { SearchPipeModule } from 'src/app/pipes/search.module';

const routes: Routes = [
  {
    path: '',
    component: WishlistPage,
  }
];

@NgModule({
  imports: [
    PipesModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    ProductDetailsComponentsModule,SearchPipeModule



  ],
  declarations: [WishlistPage]
})
export class WishlistPageModule {}
