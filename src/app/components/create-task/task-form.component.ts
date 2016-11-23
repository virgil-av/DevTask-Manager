import {Component, OnInit, Output, EventEmitter} from "@angular/core";
import {Validators, FormGroup, FormBuilder} from "@angular/forms";
import {DatabaseService} from "../../services/database.service";
import {AuthService} from "../../services/auth.service";


@Component({
  selector: 'add-task',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit{

  taskForm: FormGroup;
  formSettings: any;
  categorySettings: any;
  usersSettings: any;
  @Output() updateTasks: EventEmitter<any> = new EventEmitter();
  author: string;

  constructor(private formBuilder: FormBuilder,
              private dbService: DatabaseService,
              private auth: AuthService) {

    // get the name of the logged user, implemented on the task initialization.
      this.author = auth.loggedUser();



    this.taskForm = formBuilder.group({
      'title': ['', [Validators.required, Validators.minLength(5)]],
      'status': ['New', [Validators.required]],
      'priority': ['Normal', [Validators.required]],
      'assignee': [''],
      'category': [''],
      'comment': [''],
      'date': [new Date()],
      'author': [this.author], // auth0 get author of task
      'discussion': formBuilder.array([]),
      'testers': formBuilder.array([])
    });

  }

  ngOnInit() {
    this.dbService.getFormSettings().subscribe(response => this.formSettings = response);
    this.dbService.getCategorySettings().subscribe(response => this.categorySettings = response);
    this.dbService.getUsersSettings().subscribe(response => this.usersSettings = response);
  }

  resetForm() {
    this.taskForm.reset({
      'status': 'New',
      'priority': 'Normal',
      'assignee': '',
      'category': '',
      'comment': '',
      'date': new Date(),
      'author': this.author,
      'discussion': [],
      'testers': []
    }); // resets the form after submission
  }

  onSubmit() {
    // console.log(this.taskForm.value); //to be removed on production
    this.dbService.postOnDatabase(this.taskForm.value) // connecting to service post
      .subscribe(response => {
        this.updateTasks.emit(response); // notify parent about a new task to update table
      }); // subscribes to the response

    this.resetForm();

    $('#ModalWindow').modal('hide'); //closes modal window upon submission

  }



}
