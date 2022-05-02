import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignInPage } from './signin';
import { Routes, RouterModule } from '@angular/router';
import { CDVPhotoLibraryPipe } from '../../pipes/cdvphotolibrary.pipe';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from 'src/app/components/auth.components.module';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserService } from 'src/app/services/browser.service';

const routes: Routes = [
  {
    path: '',
    component: SignInPage,
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
    ComponentsModule,
    TranslateModule.forChild()

  ],
  declarations: [SignInPage],
  exports:[],
  providers:[BrowserService]
})
export class SignInPageModule {}
