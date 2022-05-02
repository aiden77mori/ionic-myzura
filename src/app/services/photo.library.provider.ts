import { Injectable } from "@angular/core";
// import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
// import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { Platform } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImageProvider } from "./image.provider";

declare let cordova: any;

@Injectable({ providedIn: 'root' })
export class PhotoLibraryProvider {
	private images: Array<any> = [];
	private galleryPhotoOptions: CameraOptions;

	// imageResponse: any;
	options: any;
	 constructor(
		 private imageProvider: ImageProvider,    
		 public camera: Camera,
		private imagePicker: ImagePicker, private platfrom: Platform) {
			this.galleryPhotoOptions = {
				// quality: 50,
				// targetWidth: 384,
				// targetHeight: 384,
				destinationType: this.camera.DestinationType.DATA_URL,
				encodingType: this.camera.EncodingType.JPEG,
				correctOrientation: true
			  };
		  

		// this.fetchImages();
	}

	// async fetchImages() {
	// 	// return this.photoLibrary.requestAuthorization()
	// 	// 	.then(res => {
	// 	// 		this.photoLibrary.getLibrary().subscribe({
	// 	// 			next: chunk => {
	// 	// 				let result: any;
	// 	// 				result = Object.assign({}, chunk);
	// 	// 				this.images = result.library.map((image: any) => ({ thumbnailUrl: 'file://' + image.id.split(';')[1], mediumSizeUrl: 'file://' + image.id.split(';')[1] }));
	// 	// 			}
	// 	// 		});
	// 	// 	});

	// 	return new Promise((resolve, reject)=>{
	// 		this.photoLibrary.requestAuthorization().then(async res=>{
	// 			console.log(res, 'AUTORIZED')
	// 			this.getImages().then(res=>{
	// 				resolve(res)

	// 			})

	// 			// this.photoLibrary.getLibrary().subscribe({
	// 			// 	next: chunk => {
	// 			// 		let result: any;
	// 			// 		result = Object.assign({}, chunk);
	// 			// 		try {
	// 			// 			this.images = result.library.map((image: any) => ({ thumbnailUrl: 'file://' + image.id.split(';')[1], mediumSizeUrl: 'file://' + image.id.split(';')[1] }));
	// 			// 			console.log(this.images);
	// 			// 			if(this.platfrom.is('ios')){
	// 			// 			 	this.images = result.library.map((image: any) => ({ thumbnailUrl: image.thumbnailURL, mediumSizeUrl: image.photoURL }));

	// 			// 			}
	// 			// 			resolve(this.images);
	
	// 			// 		} catch (error) {
	// 			// 			console.log(error)
	// 			// 			this.images = result.library.map((image: any) => ({ thumbnailUrl: image.thumbnailURL, mediumSizeUrl: image.photoURL }));
	// 			// 			console.log(this.images);
	// 			// 			resolve(this.images);
	
	// 			// 		}
	// 			// 		resolve(this.images);
	// 			// 	}
	// 			// });
	// 		})
	// 	})
	// 	// const photolib = cordova.plugins['photoLibrary'];
	// 	// photolib.getLibrary( 
	// 	//   (chunk)=>{
	// 	// 	let result: any;
	// 	// 	result = Object.assign({}, chunk);
	// 	// 	this.images = result.library.map((image: any) => ({ thumbnailUrl: 'file://' + image.id.split(';')[1], mediumSizeUrl: 'file://' + image.id.split(';')[1] }));

	// 	// 	console.log(this.images)
	// 	// 	// chunk.library.forEach( (libraryItem)=> {
	// 	// 	//   console.log(libraryItem.id, libraryItem);
	// 	// 	// })
	// 	// 	if (chunk.isLastChunk){
	// 	// 	  console.log("DONE")
	// 	// 	}
	// 	// 	return(this.images)

	// 	//   },
	// 	//   (err)=>console.log(err),
		  
	// 	// )
	// }

	// requestPermission(){
	// 	this.photoLibrary.requestAuthorization()
	// }
	// async getLibrary() {
		
	// 	this.fetchImages();

	// 	return this.images;
	// }

	public loadMultipleImageFromGallery() {  
		let options: ImagePickerOptions = {  
			//here Quality of images, defaults to 100  
			quality: 100,  
			//here Width of an Image  
			width: 600,  
			//here Height of an Image  
			height: 600,  
			/** Output type, defaults to 0 (FILE_URI). 
	 
			* FILE_URI :0 (number) it returns a actual path for an image 
	 
		
			DATA_URI: 1(number) it returns a base64 data  
			for an image  
			outputType: 1  
			//here Maximum image count for selection, defaults to 15.  
			maximumImagesCount: 15(1 - 15) numbers  
			//while setting a number 15 we can load 15 images in one selection.  

				*/  
		};  
		return new Promise((resolve, reject)=>{
			this.imagePicker.getPictures(options).then((results) => {  
				console.log("Images", this.images);  
	
				let result = Object.assign({}, results);
	
				//THIS IS AWESOMEEEE!!!!
				this.images = result.library.map((image: any) => ({ thumbnailUrl: 'file://' + image.id.split(';')[1], mediumSizeUrl: 'file://' + image.id.split(';')[1] }));
	
				// for (let index = 0; index < results.length; index++) {  
				// 	//here iam converting image data to base64 data and push a data to array value.  
				// 	this.images.push('data:image/jpeg;base64,' + results[index]);  
				// }  
				// console.log("Images", this.images);  
				resolve(this.images)
			}, (error) => {  
				// Handle error   
				console.log("error occured", error);  
				resolve(this.images)
	
			});  
		})
	} 

	hasReadPermission() {
		return this.imagePicker.hasReadPermission()
	  }
	 
	  requestReadPermission() {
		// no callbacks required as this opens a popup which returns async
		return this.imagePicker.requestReadPermission();
	  }




	  getImages() {
		this.options = {

		  // Android only. Max images to be selected, defaults to 15. If this is set to 1, upon
		  // selection of a single image, the plugin will return it.
		  //maximumImagesCount: 3,
	
		  // max width and height to allow the images to be.  Will keep aspect
		  // ratio no matter what.  So if both are 800, the returned image
		  // will be at most 800 pixels wide and 800 pixels tall.  If the width is
		  // 800 and height 0 the image will be 800 pixels wide if the source
		  // is at least that wide.
		//   width: 600,
		  //height: 200,
	
		  // quality of resized image, defaults to 100
		//   quality: 100,
	
		  // output type, defaults to FILE_URIs.
		  // available options are 
		  // window.imagePicker.OutputType.FILE_URI (0) or 
		  // window.imagePicker.OutputType.BASE64_STRING (1)
		  outputType: 1
		};
		let images = [];
		return new Promise((resolve, reject)=>{
			this.imagePicker.getPictures(this.options).then((results) => {
				for (var i = 0; i < results.length; i++) {
					console.log( results[i])
				  images.push('data:image/jpeg;base64,' + results[i]);
				}
				resolve(images);
			  }, (err) => {
				console.log(err);
				resolve([])

			  });
		})
	  }


	  openGallery(){
		this.galleryPhotoOptions.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
		// Get picture from camera or gallery.
		return new Promise((resolve, reject) =>{
			this.camera.getPicture(this.galleryPhotoOptions).then((imageData) => {
				// Process the returned imageURI.
				console.log(imageData)
				let imgBlob = "data:image/jpeg;base64," + imageData;  //this.imageProvider.imgURItoBlob("data:image/jpeg;base64," + imageData);
				resolve (imgBlob)
			});
		})
	  }

}