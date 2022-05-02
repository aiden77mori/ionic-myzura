import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchBrandFilter'
})
@Injectable()
export class SearchBrandPipe implements PipeTransform {
  // SearchPipe
  // Filter user search results for name or username excluding the excludedIds.
  transform(products: any[], data: any): any {
    let term = data;
    if (!products) {
      return;
    } else {
      term = term.toLowerCase();
      products =  products.filter((product) => (product.name.toLowerCase().indexOf(term) > -1 || product.link.toLowerCase().indexOf(term) > -1));
      if(products.length == 0){
        products = [{name: term, link:"https://www.google.es/search?q="+term}]
      }

      return products
    }
  }
}
