import { NgModule } from '@angular/core';
import { SearchPipe } from './search';
import { ProfilenamePipe } from './profilename/profilename';
import { SearchProductPipe } from './search.product.';
@NgModule({
  declarations: [SearchPipe,SearchProductPipe, ProfilenamePipe],
  imports: [],
  exports: [SearchPipe,SearchProductPipe,ProfilenamePipe]
})
export class SearchPipeModule {}