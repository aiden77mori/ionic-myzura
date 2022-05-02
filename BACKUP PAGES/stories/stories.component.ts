import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { StoryService } from 'src/app/services/story.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.scss'],
})
export class StoriesComponent implements OnInit {
  @Input() addStory: boolean = false;
  @Input() stories: Observable<any>;

  @ViewChild('stories', { static: false }) storiesElement: ElementRef;

  private seen: any[] = [];
  public storiesId: string;


  skin = "Snapgram";
  skins: any = {
    'Snapgram': {
      'avatars': true,
      'list': false,
      'autoFullScreen': false,
      'cubeEffect': true
    }
  };

  constructor(private router: Router, private storyService: StoryService) {
    
    
  }

  goStory() {
    this.router.navigate(['tabs/reviews/add-story']);
  }


  ngOnInit() {
    if (!this.stories) {
      console.log('No stories Observable assigned!');
      return;
    }

    this.storiesId = 'stories' + Math.floor(Math.random() * 100);
    console.log(this.storiesId);

    this.stories.pipe(take(1)).subscribe(stories => {

      console.log('Stories', stories);
      let zukeModal = null;
      let storyList = null;
      let myElement = (<HTMLDivElement>document.getElementById(this.storiesId));

      myElement.innerHTML = "";

      zukeModal = (<HTMLDivElement>document.getElementById("zuck-modal" + this.storiesId))
      if (zukeModal) {

        if (zukeModal.parentNode) {
          zukeModal.parentNode.removeChild(zukeModal);
        }
      }

      let feeds = [];
      let that = this;
      if (stories && stories.length > 0) {
        stories.forEach((story: any) => {          
          try {
            let feed = {
              id: story.storyId,
              photo: story.photo,
              name: story.name,
              link: story.link,
              lastUpdated: story.lastUpdated,
              items: []
            }

            story.items.map((item, index) => {
              const objItem = { id: index, ...item };
              console.log('Building items', objItem);
              feed.items.push(objItem);
            })
            feeds.unshift(feed);
          } catch (err) {

          }
        });
      }

      storyList = new (<any>window).Zuck(this.storiesId, {
        backNative: true,
        autoFullScreen: this.skins[this.skin]['autoFullScreen'],
        skin: 'snapgram',
        avatars: this.skins[this.skin]['avatars'],
        list: this.skins[this.skin]['list'],
        cubeEffect: this.skins[this.skin]['cubeEffect'],
        localStorage: true,
        stories: feeds,
        callbacks: {
          onView(storyId) {
            console.log(storyId);

          },
          onEnd(storyId, callback) {
            console.log('end', storyId);
            that.seen.push(storyId);
            callback();  // on end story
          },
          onClose(storyId, callback) {
            that.seen.forEach(key =>
              that.storyService.readStory(key)
            );

            callback();  // on close story viewer
          },
        }

      });

    });

  }

}
