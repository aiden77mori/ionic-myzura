import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ImageCompressorService {

  private compressedFiles: FileResult[];
  private fileListEmitter: Subject<FileResult[]>;
  private compat: BrowserCompatibilityOptions;
  private updateCompressedFiles = (file : FileResult , action) => {
    if (!file ) {
      console.log('no file selected');
      this.compressedFiles = [] ;
      this.fileListEmitter.next(this.compressedFiles);
      return ;
               }
    if (action ) {
     switch (action) {
        case 'add' : {
           this.compressedFiles.push(file);
           this._zone.run(() => {
             this.fileListEmitter.next(this.compressedFiles);});
           break;
        }
        case 'delete' : {
            this.compressedFiles.forEach((item , index) => {
            if (item === file) {
            this.compressedFiles.splice(index , 1);
            this.fileListEmitter.next(this.compressedFiles); }
          });
            break;  }
            }}}

  public  getCompressedFiles = () => this.fileListEmitter.asObservable() ;


  constructor(private _zone : NgZone) {
    this.compressedFiles = new Array<FileResult>();
    this.fileListEmitter = new Subject<FileResult[]>();
    this.compat = new BrowserCompatibility().init();
    if (!this.compat.toBlob) {
      BrowserCompatibility.addToBlobPolyfill();
    }
  }

  compress(fileList: FileList, namePrefix: string, width: number, height: number, extension: string , quality: number) {
    for (let i = 0 ; i < fileList.length; i++) {
      const ic = new ImageCompressor(
         this.updateCompressedFiles,
         fileList.item(i),
         width,
         height,
         extension,
         quality,
         namePrefix,
         this.compat);
    }
  }




}

export class BrowserCompatibility {
  constructor()  {}

  static addToBlobPolyfill() {
    Object.defineProperty(HTMLCanvasElement.prototype , 'toBlob' , {
      value(callback , extension , quality) {
        const canvas: HTMLCanvasElement = this ;

        setTimeout(function() {

          const binStr = atob(canvas.toDataURL(extension , quality).split(',')[1] );
          const len = binStr.length ;
          const byteNumbers = new Array(len);
          let arr: Uint8Array  ;

          for (let i = 0 ; i < len ; i++) {
            byteNumbers[i] = binStr.charCodeAt(i);
            }
          arr = new Uint8Array(byteNumbers);
          callback(new Blob([arr] , {type : extension}));
        }, 10

        );
      }
    });
  }

  init(): BrowserCompatibilityOptions {
    const blob = HTMLCanvasElement.prototype.toBlob ? true : false;
    const url = URL.createObjectURL ? true : false;
    let fileCtor: boolean;
    let file: File;
    try {file = new File([], 'test'); fileCtor = true; } catch ( err ) {fileCtor = false; }
    return {
      toBlob : blob ,
      fileConstructor : fileCtor ,
      urlCreateObjectUrl : url
    };
  }
}
export interface BrowserCompatibilityOptions {
toBlob: boolean;
fileConstructor: boolean;
urlCreateObjectUrl: boolean;
}

export interface FileResult {
  file: File | Blob;
  name: string;
  imgUrl: SafeUrl;
  fileSize: number;

}

class ImageCompressor {
  constructor(
              private doneCallback: (_file: FileResult , action: 'add' | 'delete') => void ,
              private file: File,
              private newWidth: number,
              private newHeight: number,
              private extension: string,
              private quality: number,
              private namePrefix: string,
              private compat: BrowserCompatibilityOptions )  {
       const reader = new FileReader();
       reader.readAsDataURL(this.file);
       reader.onload = this.readerOnloadCallback();
       reader.onerror = (err) => { console.error(err); };
  }

  private readerOnloadCallback() {
    return  (event: ProgressEvent) => {
        const originalImage = new Image();
        originalImage.src = (event.target as any).result;
        originalImage.onerror = (err) => console.error(err);
        originalImage.onload = this.imageOnloadCallback(originalImage);
  }; }

  private imageOnloadCallback(img: HTMLImageElement) {
    return () => {

     const canvas = document.createElement('canvas');
     const namePrefix = this.namePrefix ;
     canvas.width = this.newWidth;
     canvas.height = this.newHeight;
     const context = canvas.getContext('2d') as CanvasRenderingContext2D;
     context.drawImage(img , 0 , 0 , canvas.width , canvas.height);

     context.canvas.toBlob(blob => {

      let newFile: any;
      let size: number ;
      let imgUrl: any ;
      if (this.compat.fileConstructor) {
         newFile =  new File([blob], namePrefix , {type : blob.type , lastModified : Date.now() }) ;
         const fr: FileResult = {
          file : newFile ,
          name : this.namePrefix + Date.now()  ,
          imgUrl : this.compat.urlCreateObjectUrl ? URL.createObjectURL(newFile) : imgUrl,
          fileSize : newFile.size ? newFile.size : size
        };
         if (this.compat.urlCreateObjectUrl) {

              URL.revokeObjectURL(newFile); }
         this.doneCallback(fr , 'add');
      } else {

        newFile = blob ;
        size = blob.size ;
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () =>  { imgUrl = reader.result ;
                                    const fr: FileResult = {
      file : newFile ,
      name : this.namePrefix + Date.now()  ,
      imgUrl : reader.result ,
      fileSize : newFile.size ? newFile.size : size ,

    };
                                    this.doneCallback(fr , 'add');
                                    console.log('Local : ' + localStorage.length);
                                    console.log('Local : ' + sessionStorage.length);
      }; }
 } , this.extension  , this.quality);
}; }
}
