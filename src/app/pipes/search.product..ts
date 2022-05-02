import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchProductFilter'
})
@Injectable()
export class SearchProductPipe implements PipeTransform {
  // SearchPipe
  // Filter user search results for name or username excluding the excludedIds.
  transform(products: any[], data: [[any], any]): any {
    let excludedIds = data[0];
    var term: string = data[1];
    if (!products) {
      return;
    } else if (!excludedIds || !term) {
      return products;
    } else {

      term = term.toLowerCase();
      return products.filter((product) => excludedIds.indexOf(product.id) == -1 &&
      (this.normalizeTerm(product.name).toLowerCase().indexOf(term) > -1 || 
      this.normalizeTerm(product.description).toLowerCase().indexOf(term) > -1 || 
      product.brand.toLowerCase().indexOf(term) > -1));
    }
  }

  normalizeTerm(str){
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
}
