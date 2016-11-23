import {Component, Input, OnChanges, Output, EventEmitter} from "@angular/core";
import {Validators, FormGroup, FormBuilder} from "@angular/forms";
import {DatabaseService} from "../../services/database.service";
import {Settings} from "../../shared/settings";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnChanges {

  editTask: FormGroup;
  formSettings: any;
  categorySettings: any;
  usersSettings: any;
  @Input() selectedTask;
  @Output() updateTask: EventEmitter<any> = new EventEmitter;
  discussion: any;
  testers: any;
  messageAuthor: string;
  anyErrors: Error;


  constructor(private formBuilder: FormBuilder,
              private dbService: DatabaseService,
              private auth: AuthService) {

    // get the name of the logged user, implemented on the discussion.
    if ((<any>this.auth).userProfile != null) {
      this.messageAuthor = (<any>this.auth).userProfile.user_metadata.name;
    } else {
      this.messageAuthor = (<any>this.auth).userProfile.email;
    }

    this.dbService.getFormSettings()
      .subscribe(response => this.formSettings = response,
        error => this.anyErrors = error
      );

    this.dbService.getCategorySettings()
      .subscribe(response => this.categorySettings = response,
        error => this.anyErrors = error
      );

    this.dbService.getUsersSettings()
      .subscribe(response => this.usersSettings = response,
        error => this.anyErrors = error
      );

  }

  ngOnChanges() {

    this.discussion = this.selectedTask.discussion;
    this.testers = this.selectedTask.testers;

    this.editTask = this.formBuilder.group({
      '_id': [this.selectedTask._id],
      'title': [this.selectedTask.title, [Validators.required, Validators.minLength(5)]],
      'status': [this.selectedTask.status, [Validators.required]],
      'priority': [this.selectedTask.priority, [Validators.required]],
      'assignee': [this.selectedTask.assignee],
      'category': [this.selectedTask.category],
      'comment': [this.selectedTask.comment],
      'date': [this.selectedTask.date],
      'author': [this.selectedTask.author],
      'lastEdit': [new Date()],
      'discussion': [this.discussion],
      'testers': [this.testers]
    });

  }

  onSave() {
    this.dbService.editOnDatabase(this.editTask.value, this.editTask.value._id.$oid) // connecting to service put
      .subscribe(response => {
          this.updateTask.emit(response); // notify parent about edited task to update tasks table
        },
        error => this.anyErrors = error
      ); // subscribes to the response

    $('#EditTask').modal('hide'); //closes modal window upon submission

  }

  addMessage(messageForm) {
    let messageObject = {
      'message': messageForm.value.message,
      'user': this.messageAuthor,
      'date': new Date()
    };

    this.discussion.push(messageObject); //adds the value to local array and it used for the database

    this.dbService.editOnDatabase(this.editTask.value, this.editTask.value._id.$oid) // connecting to service put
      .subscribe(response => response,
        error => this.anyErrors = error //in case of db error messageObjected will not be added, an error message will be displayed
      );

    messageForm.reset();
  }


  addTester(testerForm) {
    let hasTester = false;

    for (let i = 0; i < this.testers.length;) {
      if (this.testers[i].name == testerForm.value.tester) {
        hasTester = true;
        break;
      } else {
        i++
      }
    }

    if (hasTester == false) {
      let testerObject = {
        'name': testerForm.value.tester,
        'date': new Date(),
        'progress': '0'
      };

      this.testers.push(testerObject);

      this.dbService.editOnDatabase(this.editTask.value, this.editTask.value._id.$oid) // connecting to service put
        .subscribe(response => response,
          error => this.anyErrors = error //in case of db error messageObjected will not be added, an error message will be displayed
        );

    }
    testerForm.reset();

  }


  removeTester(testerDate) {

    for (let i = 0; i < this.testers.length; i++) {
      if (this.testers[i].date == testerDate) {
        this.testers.splice(i, 1);
      }
    }

    this.dbService.editOnDatabase(this.editTask.value, this.editTask.value._id.$oid) // connecting to service put
      .subscribe(response => response,
        error => this.anyErrors = error //in case of db error tester will not be deleted
      );

  }


}
