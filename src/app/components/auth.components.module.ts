import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ShowHidePasswordComponent } from './show-hide-password/show-hide-password.component';
import { BodyTypeComponent } from './body/body.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),

  ],
  declarations: [
    ShowHidePasswordComponent,
    BodyTypeComponent

  ],
  exports: [
    ShowHidePasswordComponent,
    BodyTypeComponent
  
  ]
})
export class ComponentsModule {}
