import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QrScannerPage } from './qr-scanner';
import { Routes, RouterModule } from '@angular/router';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { ProductDetailsComponentsModule } from 'src/app/components/product-details.component.module';
import { BrowserService } from 'src/app/services/browser.service';

const routes: Routes = [
  {
    path: '',
    component: QrScannerPage,
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
    ProductDetailsComponentsModule

  ],
  declarations: [QrScannerPage]
})
export class QrScannerPageModule {}
