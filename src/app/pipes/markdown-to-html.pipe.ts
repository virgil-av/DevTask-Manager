import { Pipe, PipeTransform } from '@angular/core';
import * as marked from 'marked';

@Pipe({
  name: 'markdownToHtml'
})
export class MarkdownToHtmlPipe implements PipeTransform {

  transform(value: any, args?): any {
    if (value != null) {
      return marked(value);
    }
    return null;
  }
}
