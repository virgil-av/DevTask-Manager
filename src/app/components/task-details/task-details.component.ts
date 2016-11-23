import { Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DatabaseService} from "../../services/database.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css'],

})

export class TaskDetailsComponent implements OnInit {
  id: string;
  task: any;
  anyErrors: Error;
  isLoading = true;
  selectedTab: string = 'main';
  selectedTester: any;

  constructor(
    private dbService: DatabaseService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ){
  }


  ngOnInit(){
    this.route.params
      .map(params => params['id'])
      .subscribe((id) => {
        this.dbService.getTask(id)
          .subscribe(task => {
            this.task = task;
              this.isLoading = false;
          },
            error => this.anyErrors = error
          )
          })
  }

  thisTab(tab){
     this.selectedTab = tab;
  }

  updateEditedTask($event){
    this.task = $event;
  }

  addMessage(messageForm) {
    let messageObject = {
      'message': messageForm.value.message,
      'user': this.task.author,
      'date': new Date()
    };

    this.task.discussion.push(messageObject); //adds the value to local array and it used for the database

    this.dbService.editOnDatabase(this.task, this.task._id.$oid) // connecting to service put
      .subscribe(response => response,
        error => this.anyErrors = error //in case of db error messageObjected will not be added, an error message will be displayed
      );

    messageForm.reset();
  }

  removeTask(id, task) {
    var confirmDelete = confirm('Are you sure you want to delete: ' + task)
    if (confirmDelete != false) {
      this.dbService.deleteFromDatabase(id)
        .subscribe( response => {
            this.router.navigate(['/dashboard'])
          }
        )
    }
  }


  onProgressEdit(selectedName,selectedProgress){
    this.selectedTester = {
      'name': selectedName,
      'progress': selectedProgress,
      'date': new Date()
    }
  }

  onProgressSave(){

    for(let i = 0; i < this.task.testers.length; i++){
      if(this.task.testers[i].name == this.selectedTester.name){
        this.task.testers.splice(i, 1, this.selectedTester)

        this.dbService.editOnDatabase(this.task,this.task._id.$oid).subscribe(response => response,
              error => this.anyErrors = error
        )
      }
    }


  }


}
