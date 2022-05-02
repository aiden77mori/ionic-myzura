import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-post-grid',
  templateUrl: './post-grid.component.html',
  styleUrls: ['./post-grid.component.scss'],
})
export class PostGridComponent implements OnInit {

  @Input() timeline: Array<any>;
  @Input() search: string = "";
  @Input() userId?: string = "";
  @Input() currentUser?: string = "";

  constructor(private router : Router, public navCtrl: NavController) { }

  ngOnInit() {}

  //view post when square img
  viewPost(post) {

    if(this.userId ==this.currentUser){
      this.navCtrl.navigateForward('tabs/review/'+post.postId);
    }else{
      this.navCtrl.navigateForward('tabs/review/' +post.postId);
    }
  }
  
  openOptions(image){
    
  }
}
