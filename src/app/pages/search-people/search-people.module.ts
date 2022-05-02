import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchPeoplePage } from './search-people';
import { Routes, RouterModule } from '@angular/router';
import { SearchPipe } from 'src/app/pipes/search';
import { SearchPipeModule } from 'src/app/pipes/search.module';
import { TranslateModule } from '@ngx-translate/core';
import { UsersComponentsModule } from 'src/app/components/users.components.module';

const routes: Routes = [
  {
    path: '',
    component: SearchPeoplePage,
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SearchPipeModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    UsersComponentsModule

  ],
  declarations: [SearchPeoplePage]
})
export class SearchPeoplePageModule {}
