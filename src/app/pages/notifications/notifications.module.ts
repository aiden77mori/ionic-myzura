import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationsPage } from './notifications';
import { Routes, RouterModule } from '@angular/router';
import { SearchPipeModule } from 'src/app/pipes/search.module';
import { TranslateModule } from '@ngx-translate/core';
import { ProductDetailsComponentsModule } from 'src/app/components/product-details.component.module';
import { ProductsProvider } from 'src/app/services/providers/producs.provider';
import { PipesModule } from 'src/app/pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: NotificationsPage
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
    ProductDetailsComponentsModule,
    PipesModule

  ],
  declarations: [NotificationsPage],
  providers:[]
})
export class NotificationsPageModule {}
