import { Injectable, Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'DateFormatPipe'
})
@Injectable()
export class DateFormatPipe implements PipeTransform {
  // DateFormatPipe
  // Show moment.js dateFormat for time elapsed.
  transform(date: any, args?: any): any {
    let lang = localStorage.getItem("lang")
    let m = moment(new Date(date)).locale(lang)
    return m.fromNow()
  }
}
