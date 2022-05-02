
import { Injectable } from '@angular/core';
import { LoadingProvider } from './loading.provider';
import { DataProvider } from './data.provider';
import { Router } from '@angular/router';
import firebase from 'firebase';

@Injectable()
export class LogoutProvider {
  // Logout Provider
  // This is the provider class for logging out.
  // Before logout function can be used it's important to set the app to the Provider
  // by calling setApp(app) in the constructor of the controller that needs the logout functionality.
  constructor(public loadingProvider: LoadingProvider,
    public dataProvider: DataProvider, public router: Router) {
    console.log("Initializing Logout Provider");
  }

  // Hooks the app to this provider, this is needed to clear the navigation views when logging out.
  setRouter(router) {
    this.router = router;
  }

  // Logs the user out on Firebase, and clear navigation stacks.
  // It's important to call setApp(app) on the constructor of the controller that calls this function.
  logout() {
    return new Promise((resolve,reject)=>{
      this.loadingProvider.show();
      // Sign the user out on Firebase
      firebase.auth().signOut().then((success) => {
        // Clear navigation stacks
        location.reload();
        this.router.navigateByUrl('/', {replaceUrl: true});

        resolve(true);
      });
    });
  }

}
