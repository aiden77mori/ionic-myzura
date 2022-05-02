import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'tabs', pathMatch: 'full' },
  {
    path: 'auth/sign-in',
    loadChildren: () => import('./auth/signin/signin.module').then(m => m.SignInPageModule)
  },
  {
    path: 'auth/landing',
    loadChildren: () => import('./auth/landing/landing.module').then(m => m.LandingPageModule)
  },
  {
    path: 'auth/sign-up',
    loadChildren: () => import('./auth/signup/signup.module').then(m => m.SignUpPageModule)
  },
  {
    path: 'auth/forgot-password',
    loadChildren: () => import('./auth/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)
  },
  {
    path: 'auth/register',
    canActivate:[AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./auth/register/register.module').then(m => m.RegisterPageModule),
      },
      {
        path: 'suggests',
        loadChildren: () => import("./auth/suggests/suggests.module").then( m => m.SuggestsPageModule),
      },
    ]
  },
  


  // {
  //   path:'loader',
  //   loadChildren: () => import('./loader/loader.module').then(m => m.LoaderPageModule)
  // },
  {
    path:'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path:'verification',
    loadChildren: () => import('./verification/verification.module').then(m => m.VerificationPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
