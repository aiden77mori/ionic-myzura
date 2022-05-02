import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
// import "rxjs/add/operator/toPromise";
import { ImageEntity } from "./ImageEntity";


const URL: string = "https://unsplash.it";

@Injectable({ providedIn: 'root' })
export class UnsplashItUtil {
  constructor(private http: HttpClient) {
  }

  public getListOfImages(thumbnailSize: number): Promise<ImageEntity[]> {
    return this.http.get(`${URL}/list`).pipe(
      map(res => res)
    ).toPromise().then((unsplashEntities: any) => {

      let imageEntities: ImageEntity[] = [];
      unsplashEntities.forEach(unsplashEntity => {
        let imageEntity = new ImageEntity(unsplashEntity.id,
          `${URL}/${thumbnailSize}?image=${unsplashEntity.id}`,
          `${URL}/640?image=${unsplashEntity.id}`,
          `${URL}/2000?image=${unsplashEntity.id}`);
        imageEntities.push(imageEntity);
      });
      return imageEntities;
    }).then(imageEntities => {
      //  randomize the order
      let randomArray = this.shuffleArray(imageEntities.concat([]));
      return randomArray;
    });
  }

  shuffleArray(array): any[] {
    // found this on google
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }
}
