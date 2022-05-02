// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    // apiKey: "AIzaSyDYkSE6nwtExpD7yvWPLhAdz7Hv_slfRBk",
    // authDomain: "myzura-7e808.firebaseapp.com",
    // databaseURL: "https://myzura-7e808.firebaseio.com",
    // projectId: "myzura-7e808",
    // storageBucket: "myzura-7e808.appspot.com",
    // messagingSenderId: "980295846236",
    // appId: "1:980295846236:web:42caefd2d0a245eb51d999",
    // measurementId: "G-DK5QPM4TCG"
    apiKey: "AIzaSyCIqCAdiKeojC6AK4nUvOdfrGikVSuXCDw",
    authDomain: "myzura-1d9a0.firebaseapp.com",
    databaseURL: "https://myzura-1d9a0-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "myzura-1d9a0",
    storageBucket: "myzura-1d9a0.appspot.com",
    messagingSenderId: "600386809045",
    appId: "1:600386809045:web:4094b75f18ffb5402d865c",
    measurementId: "G-W8QSVDG058"
  },

    // Set language to use.
    language: 'en',
    // Get your Facebook App Id from your app at http://developers.facebook.com
   facebookAppId: "",// 1025234637591184

    //  LIVE ACCOUNT MAKE SURE TO GET THE client_id OF client_type 3 and NOT client_type 1!!!
    // export const googleClientId: string ="277373824972-lbl3fm2n204a3oreegisp5an1qko1fm6.apps.googleusercontent.com"
  
    // TESTing account
    // export const googleClientId: string ="854823107381-k0er0frh6q3s7msa4o2ovk14v89tj13h.apps.googleusercontent.com"
   googleClientId: "600386809045-6gin8ht7dqumu4l09jmaamog3cbq3qsn.apps.googleusercontent.com",
  
    // Set in your appropriate Login routes, don't forget to import the pages on app.module.ts  
    // export const verificationPage = VerificationPage;
    // export const trialPage = TrialPage;
    
    // Set whether emailVerification is enabled or not.
   emailVerification: true
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
