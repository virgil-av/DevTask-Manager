import {Component, OnInit, style, animate, transition, trigger} from "@angular/core";
import {DatabaseService} from "../../services/database.service";
import {AuthService} from "../../services/auth.service";


@Component({
  selector: 'list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({opacity: 0}),
        animate(500, style({opacity: 1}))
      ]),
      transition(':leave', [    // :leave is alias to '* => void'
        animate(500, style({opacity: 0}))
      ])
    ])
  ]
})

export class ListTasksComponent implements OnInit {
  selectedComment: string;
  selectedTask;
  tasks: any = [];
  sortBy: string = '-date';
  anyErrors: Error;
  isLoading: boolean = true;
  rowsPerPage: number = 20;
  sortVariable; // used as toggle for table column sorting
  filterQuery = '' // used for the search

  constructor(private dbService: DatabaseService, private auth: AuthService) {
  }

  ngOnInit() {
    this.dbService.getTasks()
      .subscribe(dbTasks => {
          this.tasks = dbTasks;
          this.isLoading = false;
        },
        error => this.anyErrors = error
      );

  }

  updateNewTask($event) {
    this.tasks.push($event);

  }

  updateEditedTask($event) {
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i]._id.$oid == $event._id.$oid) {
        this.tasks.splice(i, 1, $event);
      }
    }
  }

  readComment(comment) {
    this.selectedComment = comment;
  }

  removeTask(id, task) {
    var confirmDelete = confirm('Are you sure you want to delete: ' + task)
    if (confirmDelete != false) {
      this.dbService.deleteFromDatabase(id)
        .subscribe(response => {
          for (let i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i]._id.$oid == id) {
              this.tasks.splice(i, 1);
            }
          }
        })
    }
  }

  getTaskToEdit(task) {
    //sending the task to edit-task component
    this.selectedTask = task;
  }

  sort(type) {
    this.sortVariable = !this.sortVariable

    if (this.sortVariable) {
      this.sortBy = '-' + type;
    } else {
      this.sortBy = '+' + type;
    }


  }


}
