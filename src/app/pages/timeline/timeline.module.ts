import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimelinePage } from './timeline';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ProductDetailsComponentsModule } from 'src/app/components/product-details.component.module';
import { TimelineResolver } from './timeline.resolver';

const routes: Routes = [
  {
    path: '',
    component: TimelinePage,
    resolve: {
      data: TimelineResolver
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    // ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),

    TranslateModule.forChild(),
    ProductDetailsComponentsModule,

  ],
  declarations: [TimelinePage],
  providers:[TimelineResolver]
})
export class TimelinePageModule {}
