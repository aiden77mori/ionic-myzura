import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

// import { ComponentsModule } from '../components/components.module';

import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ComponentsModule } from 'src/app/components/auth.components.module';
import { UpdateOutfitPage } from './update-outfit.page';
import {DragDropModule} from '@angular/cdk/drag-drop';


const routes: Routes = [
  {
    path: '',
    component: UpdateOutfitPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PipesModule,
    TranslateModule.forChild(),
    ComponentsModule,
    DragDropModule
    


    // ComponentsModule
  ],
  declarations: [UpdateOutfitPage]
})
export class UpdateOutfitPageModule {}
