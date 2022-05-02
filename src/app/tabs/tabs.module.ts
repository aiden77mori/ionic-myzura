import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { HashtagPipe } from '../pipes/hashtag/hashtag';
import { SafePipe } from '../pipes/safe/safe';
import { ProfilenamePipe } from '../pipes/profilename/profilename';
import { FriendPipe } from '../pipes/friend';
import { ConversationPipe } from '../pipes/conversation';
import { SearchPipe } from '../pipes/search';
import { DateFormatPipe } from '../pipes/date';
import { GroupPipe } from '../pipes/group';
import { ImageFilterDirective } from '../services/image.filter.service';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { PhotoLibraryProvider } from '../services/photo.library.provider';
import { StoryService } from '../services/story.service';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { PostCardComponent } from '../components/post-card/post-card.component';
import { PostGridComponent } from '../components/post-grid/post-grid.component';
import { CommentsPage } from '../pages/comments/comments';
import { ImageModalPage } from '../pages/image-modal/image-modal';
import { AuthGuard } from '../services/auth.guard';
import { PipesModule } from '../pipes/pipes.module';
import { BrowserService } from '../services/browser.service';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,


  ],
  declarations: [TabsPage,
    // CommentsPage,
    // ImageModalPage,
    //Components
    // PostCardComponent,
    // PostGridComponent,

    //Pipes
    // HashtagPipe,
    SafePipe,
    // ProfilenamePipe,
    // FriendPipe,
    // ConversationPipe,
    // SearchPipe,
    // DateFormatPipe,
    GroupPipe,
    ImageFilterDirective],
  entryComponents: [
      // CommentsPage,
      // ImageModalPage,
    ],
    exports:[
      // CommentsPage,
      // ImageModalPage,
    ], 
    providers:[BrowserService,
      AuthGuard,
      // NativeGeocoder,
      PhotoLibrary,    
      FileChooser,
      StoryService,
      FilePath,
      Base64,
      // AdMob,
      PhotoLibraryProvider
    ],
})
export class TabsPageModule {}
