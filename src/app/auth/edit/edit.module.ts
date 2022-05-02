import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

// import { ComponentsModule } from '../components/components.module';

import { EditProfilePage } from './edit.page';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ComponentsModule } from 'src/app/components/auth.components.module';

const routes: Routes = [
  {
    path: '',
    component:  EditProfilePage
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


    // ComponentsModule
  ],
  declarations: [ EditProfilePage]
})
export class  EditProfilePageModule {}
