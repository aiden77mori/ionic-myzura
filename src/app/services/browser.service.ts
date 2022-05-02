import { Injectable } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
  
@Injectable()
export class BrowserService{

 
  constructor(
    public iab: InAppBrowser    
  ) {

  }

  browseLink(link: string) {
  //   const browser = this.iab.create(link, '_blank', 'lefttoright=yes,toolbar=no,location=no');
   
  //   browser.on('loadstart').subscribe(event => {
  //     if(event.url.indexOf('closeapp') !== -1) {
  //       let currenturl = (event.url).replace('closeapp', '');
  //       console.log(currenturl);
  //       browser.close();
  //     }
  //   });
  //   browser.on('loadstop').subscribe(event => {

  //     //browser.insertCSS({ code: "body{color: red;}" });
  //     let pageData = `var arrowButtonTopRight = document.createElement('I');
  //   arrowButtonTopRight.style = 'border-style: solid; border-color: black; border-width: 0px 4px 4px 0px; display: inline-block; padding: 6px; transform: rotate(-45deg); -webkit-transform: rotate(-45deg); margin-top: 25px; margin-left: 20px;'; 
  //   topContainer.appendChild(arrowButtonTopRight);
  //   arrowButtonTopRight.onclick = function() { window.location=window.location.href + 'closeapp' }
  //   var arrowButtonTopLeft = document.createElement('I');
  //   arrowButtonTopLeft.style = 'border-style: solid; border-color: black; border-width: 0px 4px 4px 0px; display: inline-block; padding: 6px; transform: rotate(135deg); -webkit-transform: rotate(135deg); margin-top: 25px;'; 
  //   topContainer.appendChild(arrowButtonTopLeft);
  //   arrowButtonTopLeft.onclick = function() { window.location=window.location.href + 'closeapp' }`;

  //   let codeData = `var toolbar = document.createElement('Div');
  //   toolbar.style = 'bottom:0; width: 100%; height: 40px; background-color: white; border-top: 1px solid #f4f4f4; position: fixed; z-index: 999;'
  //   document.body.appendChild(toolbar)
  //   var arrowContainer = document.createElement('Div');
  //   arrowContainer.style = 'width: 100%; height :100%;';
  //   toolbar.appendChild(arrowContainer);
  //   var arrowButtonLeft = document.createElement('I');
  //   arrowButtonLeft.style = 'border-style: solid; border-color: black; border-width: 0px 4px 4px 0px; display: inline-block; padding: 6px; transform: rotate(135deg); -webkit-transform: rotate(135deg); margin-top: 12px; margin-left: 20px;'; 
  //   arrowContainer.appendChild(arrowButtonLeft);
  //   arrowButtonLeft.onclick = function() { window.history.back(); };
  //   var arrowButtonRight = document.createElement('I');
  //   arrowButtonRight.style = 'border-style: solid; border-color: black; border-width: 0px 4px 4px 0px; display: inline-block; padding: 6px; transform: rotate(-45deg); -webkit-transform: rotate(-45deg); margin-top: 12px; margin-left: 40px;'; 
  //   arrowContainer.appendChild(arrowButtonRight);
  //   arrowButtonRight.onclick = function() { window.history.forward(); }
  //   var topbar = document.createElement('Div');
  //   topbar.style = 'height: 60px; background-color: white; position: fixed; top: 0; width :100%; border-bottom: 1px solid #f4f4f4; z-index: 999;';
  //   document.body.appendChild(topbar);
  //   var topContainer = document.createElement('Div');
  //   topContainer.style = 'width: 100%; height :100%;';
  //   topbar.appendChild(topContainer);
  //   ${pageData}`;

  //   browser.executeScript({
  //     code: codeData
  //   });

  //   browser.insertCSS({ 
  //     code: "body { position: absolute; top: 60px; height: 70% }" 
  //   });

  //  });

  //  return(browser)

    this.iab.create(link, '_system')
  }

  getLink(link: string) {
    const browser = this.iab.create(link, '_blank', 'lefttoright=yes,toolbar=no,location=no');
   /*
    browser.on('loadstart').subscribe(event => {
      if(event.url.indexOf('closeapp') !== -1) {
        let currenturl = (event.url).replace('closeapp', '');
        console.log(currenturl);
        browser.close();
      }
    });*/

    browser.on('loadstop').subscribe(event => {
      //browser.insertCSS({ code: "body{color: red;}" });
      let pageData = '';

      pageData = `var arrowButtonTopLeft = document.createElement('I');
      arrowButtonTopLeft.style = 'border-style: solid; border-color: black; border-width: 0px 4px 4px 0px; display: inline-block; padding: 6px; transform: rotate(135deg); -webkit-transform: rotate(135deg); margin-top: 25px; margin-left: 20px;'; 
      topContainer.appendChild(arrowButtonTopLeft);
      arrowButtonTopLeft.onclick = function() { window.history.back(); };
      var titleContainer = document.createElement('Div');
      titleContainer.innerHTML = 'Busca la prenda'; 
      titleContainer.style = 'font-size: 15px; font-family: Arial, Helvetica, sans-serif; text-align: center; margin-top: -23px;';
      topContainer.appendChild(titleContainer);
      var button = document.createElement('Button'); 
      button.innerHTML = 'Subir al Armario'; 
      button.style = 'font-size: 13px; font-family: Arial, Helvetica, sans-serif; bottom:45px; width:140px; left: 30%; text-align: center; position: fixed; color: #fff; background-color: #000; height: 35px; border-radius: 10px; z-index: 999;'; 
      document.body.appendChild(button); 
      button.onclick = function() { window.location=window.location.href + 'closeapp' };`;
      
    let codeData = `var toolbar = document.createElement('Div');
    toolbar.style = 'bottom:0; width: 100%; height: 40px; background-color: white; border-top: 1px solid #f4f4f4; position: fixed; z-index: 999;'
    document.body.appendChild(toolbar)
    var arrowContainer = document.createElement('Div');
    arrowContainer.style = 'width: 100%; height :100%;';
    toolbar.appendChild(arrowContainer);
    var arrowButtonLeft = document.createElement('I');
    arrowButtonLeft.style = 'border-style: solid; border-color: black; border-width: 0px 4px 4px 0px; display: inline-block; padding: 6px; transform: rotate(135deg); -webkit-transform: rotate(135deg); margin-top: 12px; margin-left: 20px;'; 
    arrowContainer.appendChild(arrowButtonLeft);
    arrowButtonLeft.onclick = function() { window.history.back(); };
    var arrowButtonRight = document.createElement('I');
    arrowButtonRight.style = 'border-style: solid; border-color: black; border-width: 0px 4px 4px 0px; display: inline-block; padding: 6px; transform: rotate(-45deg); -webkit-transform: rotate(-45deg); margin-top: 12px; margin-left: 40px;'; 
    arrowContainer.appendChild(arrowButtonRight);
    arrowButtonRight.onclick = function() { window.history.forward(); }
    var topbar = document.createElement('Div');
    topbar.style = 'height: 60px; background-color: white; position: fixed; top: 0; width :100%; border-bottom: 1px solid #f4f4f4; z-index: 999;';
    document.body.appendChild(topbar);
    var topContainer = document.createElement('Div');
    topContainer.style = 'width: 100%; height :100%;';
    topbar.appendChild(topContainer);
    ${pageData}`;
    browser.executeScript({
    code: codeData
    });
   });
   browser.insertCSS({ 
    code: "body { position: absolute; top: 60px; height: 70% }" 
  });
   return(browser)
  }


}
