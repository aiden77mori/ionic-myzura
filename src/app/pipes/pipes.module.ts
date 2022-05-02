import { NgModule } from '@angular/core';
import { CDVPhotoLibraryPipe } from './cdvphotolibrary.pipe';
import { FriendPipe } from './friend';
import { ConversationPipe } from './conversation';
import { DateFormatPipe } from './date';
import { HashtagPipe } from './hashtag/hashtag';
import { SortByPipe } from './sort.by.pipe';
import { SearchBrandPipe } from './search.brand';
@NgModule({
  declarations: [CDVPhotoLibraryPipe, FriendPipe,DateFormatPipe,SortByPipe,ConversationPipe, HashtagPipe, SearchBrandPipe],
  imports: [],
  exports: [CDVPhotoLibraryPipe, FriendPipe,DateFormatPipe, SortByPipe, ConversationPipe, HashtagPipe, SearchBrandPipe]
})
export class PipesModule {}