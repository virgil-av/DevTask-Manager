import {Component, OnInit, Output, EventEmitter, style, animate, transition, trigger} from "@angular/core";
import {AuthService} from "../../services/auth.service";
import {DatabaseService} from "../../services/database.service";

@Component({
  selector: 'table-toolbar',
  templateUrl: './table-toolbar.component.html',
  styleUrls: ['./table-toolbar.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({opacity: 0}),
        animate(900, style({opacity: 1}))
      ]),
      transition(':leave', [    // :leave is alias to '* => void'
        animate(900, style({opacity: 0}))
      ])
    ])
  ]
})
export class TableToolbarComponent implements OnInit {

  constructor(private auth: AuthService, private dbService: DatabaseService) {
  }

  formSettings: any;
  categorySettings: any;
  usersSettings: any;
  rowsDefault: number = 20;
  @Output() rowsPerPage: EventEmitter<any> = new EventEmitter;
  @Output() searchTerm: EventEmitter<any> = new EventEmitter;
  stateOfToolbar;
  isLoading = true;
  isAnimated = false;

  ngOnInit() {

    this.dbService.getFormSettings()
      .subscribe(response => {
        this.formSettings = response;
          this.isLoading = false;
        }
      );

    this.dbService.getCategorySettings()
      .subscribe(response => {
        this.categorySettings = response;
        this.isLoading = false;
        }
      );

    this.dbService.getUsersSettings()
      .subscribe(response => {
        this.usersSettings = response;
        this.isLoading = false;
        }
      );


  }

  emitRows() {
    this.rowsPerPage.emit(this.rowsDefault);
  }

  emitSearch(value) {
    this.searchTerm.emit(value);
  }

  resetForm(form) {
    this.searchTerm.emit('');
    form.reset({
      category: '',
      status: '',
      user: '',
      priority: ''
    });
  }

  toggleToolbare() {
    this.stateOfToolbar = !this.stateOfToolbar;
    this.isAnimated = true;

    if (this.isAnimated == true) {
      setTimeout(() => {
        this.isAnimated = false;
      }, 1000);
    }
  }


}
