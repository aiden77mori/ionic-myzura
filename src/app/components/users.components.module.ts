import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
 import { TranslateModule } from '@ngx-translate/core';
import { UserListComponent } from './user-list/user-list';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),

  ],
  declarations: [
    UserListComponent

  ],
  exports: [
    UserListComponent
  
  ]
})
export class UsersComponentsModule {}
