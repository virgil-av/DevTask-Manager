import {Component,Input} from '@angular/core';

@Component({
  selector: 'is-loading',
  template: `
      <div class="row text-center"><i *ngIf="visible" class="fa fa-spinner fa-spin fa-3x"></i></div>
  `,
  styles: []
})
export class LoadingComponent {
  @Input() visible = true;
}
