import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserInfoPage } from './user-info';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProductDetailsComponentsModule } from 'src/app/components/product-details.component.module';

const routes: Routes = [
  {
    path: '',
    component: UserInfoPage,
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
    ProductDetailsComponentsModule


  ],
  declarations: [UserInfoPage]
})
export class UserInfoPageModule {}
