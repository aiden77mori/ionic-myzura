import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewPostPage } from './view-post';
import { Routes, RouterModule } from '@angular/router';
import { ProductDetailsComponentsModule } from 'src/app/components/product-details.component.module';

const routes: Routes = [
  {
    path: '',
    component: ViewPostPage,
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ProductDetailsComponentsModule
  ],
  declarations: [ViewPostPage]
})
export class ViewPostPageModule {}
