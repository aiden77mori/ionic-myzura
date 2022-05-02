import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExplorePage } from './explore';
import { Routes, RouterModule } from '@angular/router';
import { SearchPipeModule } from 'src/app/pipes/search.module';
import { TranslateModule } from '@ngx-translate/core';
import { ProductDetailsComponentsModule } from 'src/app/components/product-details.component.module';
import { ExploreResolver } from './explore.resolver';
import { ProductsProvider } from 'src/app/services/providers/producs.provider';
import { ExploreProvider } from 'src/app/services/explore.provider';
import { UsersComponentsModule } from 'src/app/components/users.components.module';

const routes: Routes = [
  {
    path: '',
    component: ExplorePage,
    resolve: {
      data: ExploreResolver
    }
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
    ProductDetailsComponentsModule,SearchPipeModule,
    UsersComponentsModule


  ],
  declarations: [ExplorePage],
  providers:[ExploreResolver,ExploreProvider]
})
export class ExplorePageModule {}
