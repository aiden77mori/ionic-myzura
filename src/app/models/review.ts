export class Review {
  constructor(
    public reviewId: string,
    public text: string,
    public date: string,
    public photo: string,
    public likeCount: string,
    public followersCount: string,
    public followingsCount: string,
    public reviewsCount: string,
    public profilePic: string,
    public description:string,
    public isOnline:string,
    public lastLogIn:string
  ) {
 
  }
}
