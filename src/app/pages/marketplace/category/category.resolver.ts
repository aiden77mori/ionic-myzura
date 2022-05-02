import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap, delay, finalize } from 'rxjs/operators';
import { ShellProvider } from 'src/app/services/shell/shell.provider';
import { SampleShellListingModel } from 'src/app/services/shell/sample-shell.model';
import { FeedProvider } from 'src/app/services/feed.provider';

//to convert promise to observable
import { from } from 'rxjs';

@Injectable()
export class CategoryResolver implements Resolve<any> {

  constructor(
    private feedProvider: FeedProvider
  ) {}

  // These should be in a separate service
   private  getData(): Observable<any> {
    //  alert(1)
    const data = from(this.feedProvider.getProducts());

    return data;
  }

  private getDataWithShell(): Observable<SampleShellListingModel> {
    // Initialize the model specifying that it is a shell model
    const shellModel: SampleShellListingModel = new SampleShellListingModel(true);
    const dataObservable = this.getData();

    const shellProvider = new ShellProvider(
      shellModel,
      dataObservable
    );

    return shellProvider.observable;
  }

  resolve() {
    // Get the Shell Provider from the service
    const shellProviderObservable = this.getDataWithShell();

    // Resolve with Shell Provider
    const observablePromise = new Promise((resolve, reject) => {
      resolve(shellProviderObservable);
    });
    return observablePromise;
  }
}
