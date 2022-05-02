import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from '../services/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    canActivate:[AuthGuard],
    children: [
      { path: '', redirectTo: 'reviews', pathMatch: 'full' },
      {
        path: 'reviews',
        children: [
          {
            path: '',
            loadChildren: () => import("../pages/timeline/timeline.module").then( m => m.TimelinePageModule),
            pathMatch: 'full'
          },
          // {
          //   path: 'add-story',
          //   loadChildren: () => import("../pages/add-story/add-story.module").then( m => m.AddStoryPageModule),
          // },

          {
            path: 'comments/:postKey',
            loadChildren: () => import("../pages/comments/comments.module").then( m => m.CommentsPageModule),
          },

          

          {
            path: 'iframer',
            loadChildren: () => import("../pages/qr-scanner/iframe/iframe.module").then( m => m.IframePageModule),
          }
          
          
        ]
      },
                
      {
        path: 'qr-scanner',
        children: [
          {
            path: '',
            loadChildren: () => import("../pages/qr-scanner/qr-scanner.module").then( m => m.QrScannerPageModule),
            pathMatch: 'full'
          },

          

        ]

      },

      {
        path: 'explore',
        loadChildren: () => import("../pages/explore/explore.module").then( m => m.ExplorePageModule),
      },
      {
        path: 'outfits',
        loadChildren: () => import("../pages/outfits/outfits.module").then( m => m.OutfitsPageModule),
      },
      {
        path: 'filters/:productId',
        loadChildren: () => import("../pages/marketplace/filters/filters.module").then( m => m.FiltersPageModule),
      },
      {
        path: 'wishlist',
        loadChildren: () => import("../pages/marketplace/wishlist/wishlist.module").then( m => m.WishlistPageModule),
      },
      {
        path: 'category',
        loadChildren: () => import("../pages/marketplace/category/category.module").then( m => m.CategoryPageModule),
      },
      {
        path: 'marketplace',
        children: [
          {
            path: '',
            loadChildren: () => import("../pages/marketplace/marketplace.module").then( m => m.MarketplacePageModule),
            pathMatch: 'full'
          }

        ]
      },
      {
        path: 'product-details/:productId',
        children: [
          {
            path: '',
            loadChildren: () => import("../pages/product-details/product-details.module").then( m => m.ProductDetailsPageModule),
            pathMatch: 'full'
          }

        ]
      },
      // {
      //   path: 'friends',
      //   loadChildren: () => import("../pages/friends/friends.module").then( m => m.FriendsPageModule),
      // },
      {
        path: 'manage-photo',
        loadChildren: () => import("../pages/manage-photo/manage-photo.module").then( m => m.ManagePhotoPageModule),
      },
      {
        path: 'add-outfit',
        loadChildren: () => import("../pages/add-outfit/add-outfit.module").then( m => m.AddOutfitPageModule),
      },
      {
        path: 'update-outfit/:outfitId',
        loadChildren: () => import("../pages/update-outfit/update-outfit.module").then( m => m.UpdateOutfitPageModule),
      },
      {
        path: 'crop-photo',
        loadChildren: () => import("../pages/crop-photo/crop-photo.module").then( m => m.CropPhotoPageModule),
      },
      {
        path: 'review/:postId',
        loadChildren: () => import("../pages/view-post/view-post.module").then( m => m.ViewPostPageModule),
      },

      {
        path: 'crop-product',
        children: [
          {
            path: '',
            loadChildren: () => import('../pages/crop-product/crop-product.module').then(m => m.CropProductPageModule),
          },
          // {
          //   path: 'review/:postId',
          //   loadChildren: () => import("../pages/view-post/view-post.module").then( m => m.ViewPostPageModule),
          // },
          {
            path: 'publish-product',
            loadChildren: () => import("../pages/publish-product/publish-product.module").then( m => m.PublishProductPageModule),
    
          }
          
        ]
      },

      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: () => import("../pages/profile/profile.module").then( m => m.ProfilePageModule),
          },
          // {
          //   path: 'review/:postId',
          //   loadChildren: () => import("../pages/view-post/view-post.module").then( m => m.ViewPostPageModule),
          // },
          {
            path: 'settings',
            children: 
            [
              {
                path: '',
                loadChildren: () => import("../pages/settings/settings.module").then( m => m.SettingsPageModule),
              },
              {
                path: 'profit',
                loadChildren: () => import('../pages/settings/profit/profit.module').then(m => m.ProfitPageModule),
            
              },
              {
                path: 'personal',
                loadChildren: () => import('../pages/settings/personal/personal.module').then(m => m.PersonalPageModule),
            
              },
              {
                path: 'size',
                loadChildren: () => import('../pages/settings/size/size.module').then(m => m.SizePageModule),
            
              },
              {
                path: 'security',
                loadChildren: () => import('../pages/settings/security/security.module').then(m => m.SecurityPageModule),
            
              },
              {
                path: 'legal',
                loadChildren: () => import('../pages/settings/legal/legal.module').then(m => m.LegalPageModule),
            
              },
              {
                path: 'shoes/:userId',
                loadChildren: () => import('../auth/shoes/shoes.module').then(m => m.ShoesProfilePageModule),
            
              },
              {
                path: 'crop-profile',
                loadChildren: () => import('../pages/crop-profile/crop-profile.module').then(m => m.CropProfilePageModule),
            
              },
            ]
          },
          
        ]
      },
      {
        path: 'show-photo',
        loadChildren: () => import("../pages/show-photo/show-photo.module").then( m => m.ShowPhotoPageModule),
      },
      {
        path: 'publish',
        children:[
          { 
            path: '',
            loadChildren: () => import("../pages/publish/publish.module").then( m => m.PublishPageModule),
          }
        ]
      },

      {
        path: 'messages',
        children: [
          {
            path: '',
            loadChildren: () => import("../pages/messages/messages.module").then( m => m.MessagesPageModule),
          },
          {
            path: 'message',
            loadChildren: () => import("../pages/message/message.module").then( m => m.MessagePageModule),
          },
          {
            path: 'new-message',
            loadChildren: () => import("../pages/new-message/new-message.module").then( m => m.NewMessagePageModule),
          }
        ]
      },
      {
        path:  'user-info/:userId',
        children: [
          {
            path: '',
            loadChildren: () => import("../pages/user-info/user-info.module").then( m => m.UserInfoPageModule),      
          }
        ]
      },
      {
        path: 'search-people',
        loadChildren: () => import("../pages/search-people/search-people.module").then( m => m.SearchPeoplePageModule),
      },
      {
        path: 'notifications',
        loadChildren: () => import("../pages/notifications/notifications.module").then( m => m.NotificationsPageModule),
      },
      {
        path: 'users/:username/:userId/:type',
        loadChildren: () => import("../pages/followers/followers.module").then( m => m.FollowersPageModule),
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
