import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'substring'
})
export class SubstringPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value.length > 80) {
      return value.substring(0, 85) + ' ...';
    }
    return value;
  }

}
