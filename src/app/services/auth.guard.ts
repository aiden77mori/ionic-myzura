// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { DataProvider } from './data.provider';

// @Injectable()
// export class AuthGuard implements CanActivate {

//   constructor(
//     public dataProvider: DataProvider,
//     private router: Router
//   ) {}

//   canActivate(): boolean {
//     // check if user is authenticated
//     if (this.dataProvider.getLoggedInUser() != null) {
//       console.log('USER ON')
//       return true;
//     } else {
//         console.log('USER OFF')

//       // Navigate to the login page
//       this.router.navigate(['sign-in']);
//       return false;
//     }
//   }
// }


import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { DataProvider } from './data.provider';

// import { ToastService } from '../services';

@Injectable({
  providedIn: 'root',
})

export class AuthGuard implements CanActivate {
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private dataProvider: DataProvider
    ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise(resolve => {
      this.afAuth.user.subscribe(user => {
        if (user) {
          this.dataProvider.setLoggedInUser(user)
          resolve(true);
        } else {
        //   this.toast.showToast('User is not logged in');
        console.log("AUTHGUARD")
          this.router.navigateByUrl('/auth/landing');
          resolve(false);
        }
      });
    });
  }
}

// export class IntroGuard implements CanActivate {
//   constructor(
//     public storage: Storage,
//     private navCtrl: NavController,
//     private auth: AuthService
//   ) {}

//   canActivate(
//     next: ActivatedRouteSnapshot, state: RouterStateSnapshot
//   ): Observable<boolean> {

//     return new Observable<boolean>(observer=>{
//       this.getProfileByName(profileName).subscribe(profile=>{
//         if(profile){
//           observer.next(true)
//         }else{
//           observer.next(false)
//         }
//       })
//     })
//     // this.afAuth.user.subscribe(user => {
//     //   if (user) {
//     //     resolve(true);
//     //   } else {
//     //     this.toast.showToast('User is not logged in');
//     //     this.navCtrl.navigateRoot('login');
//     //     resolve(false);
//     //   }
//     // });

//     if (this.auth.isLoggedIn()) {
//       this.navCtrl.navigateRoot('home');
//     } else {
//       this.storage.get('introShown').then((introShown: boolean) => {
//         if (introShown) {
//           this.navCtrl.navigateRoot('login');
//           return false;
//         } else {
//           return true;
//         }
//       }).catch((e) => { console.log(e); });
//     }
//   }
// }

