import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfilePage } from './profile';
import { Routes, RouterModule } from '@angular/router';
import { ProductDetailsComponentsModule } from 'src/app/components/product-details.component.module';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ProfilePostsResolver } from './posts.resolver';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage,
    resolve: {
      data: ProfilePostsResolver
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
        TranslateModule.forChild(),
    ProductDetailsComponentsModule,
    PipesModule
  ],
  declarations: [ProfilePage],
  providers: [ProfilePostsResolver]
})
export class ProfilePageModule {}
