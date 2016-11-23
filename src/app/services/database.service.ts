import { Injectable } from '@angular/core';
import {Http, Headers} from "@angular/http";
import 'rxjs/add/operator/map'
import {Subject} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable()
export class DatabaseService{

  constructor(private http: Http, private auth: AuthService) {
    this.onLoggedUser();
  }

  usersList: any;

  private dbUrl = 'https://api.mlab.com/api/1/databases/taskmanager/collections/tasks';
  private settingsUrl = 'https://api.mlab.com/api/1/databases/taskmanager/collections/settings';
  private apiKey = '?apiKey=SwU9o8zJ9EQVyJhWxeqviTo-aWkRQDS5';
  private formSettings = '582a3841dcba0f5e85606f69'; // id of document
  private categorySettings = '582a3920dcba0f5e85606fd9';
  private usersSettings = '582a3962dcba0f5e85606ff1';
  private authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJMaXNVTU5JbmlTbUxHeUkyUGY4V0xMUWpmYXVCeWM5ZiIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbInVwZGF0ZSIsImNyZWF0ZSIsImRlbGV0ZSJdfX0sImlhdCI6MTQ3OTI4Nzk2NCwianRpIjoiNGQyODZiMzFkZWVmMjZkMDhhNjJhZjVjY2M4NDQyMTEifQ.Lx8Yze6fP64MqkvxAmYV7KuqMF0I20vOFEYWwWmmTVA';



  getTasks(){
    // this function returns the data from database and creates an observable
    // you will subscribe in the file you need the data to use it
    return this.http.get(this.dbUrl + this.apiKey)
      .map(response => response.json());

  }

  getTask(id){
    return this.http.get(this.dbUrl + '/' + id + this.apiKey)
      .map(response => response.json());
  }


  getFormSettings(){
    // this function returns the data from database and creates an observable
    // you will subscribe in the file you need the data to use it
    return this.http.get(this.settingsUrl + '/' + this.formSettings + this.apiKey)
      .map(response => response.json());
  }

  getCategorySettings(){
    // this function returns the data from database and creates an observable
    // you will subscribe in the file you need the data to use it
    return this.http.get(this.settingsUrl + '/' + this.categorySettings + this.apiKey)
      .map(response => response.json());
  }

  getUsersSettings(){
    // this function returns the data from database and creates an observable
    // you will subscribe in the file you need the data to use it
    return this.http.get(this.settingsUrl + '/' + this.usersSettings + this.apiKey)
      .map(response => response.json());
  }


  postOnDatabase(body){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.dbUrl + this.apiKey, JSON.stringify(body),{headers:headers})
      .map(response => response.json());

  }

  editOnDatabase(body,id){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.dbUrl + '/' + id + this.apiKey, JSON.stringify(body),{headers:headers})
      .map(response => response.json());
  }

  deleteFromDatabase(id){
    return this.http.delete(this.dbUrl + '/' + id + this.apiKey)
      .map(response => response.json());
  }


  createAuth0User(body){

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.authToken);
    return this.http.post('https://syrusstk.eu.auth0.com/api/v2/users', JSON.stringify(body),{headers:headers})
      .map(response => response.json());

  }

  editAuth0User(body,id){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.authToken);
    return this.http.patch('https://syrusstk.eu.auth0.com/api/v2/users/' + id, JSON.stringify(body),{headers:headers})
      .map(response => response.json());
  }

  deleteAuth0User(id){
    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.authToken);
    return this.http.delete('https://syrusstk.eu.auth0.com/api/v2/users/' + id,{headers:headers})
    // .map(response => response.json()); // this will not work with the auth0 api
  }

  sendUserToDb(body){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.settingsUrl + '/' + this.usersSettings + this.apiKey, JSON.stringify(body),{headers:headers})
      .map(response => response.json());
  }

  sendCategoryToDb(body){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.settingsUrl + '/' + this.categorySettings + this.apiKey, JSON.stringify(body),{headers:headers})
      .map(response => response.json());
  }


  // this manages the logged user, and creates an observable, subscribe to LoggedUser$
  private LoggedUser = new Subject<string[]>();
  LoggedUser$ = this.LoggedUser.asObservable();
  onLoggedUser(){
    if(this.auth.authenticated()){
      this.getUsersSettings().subscribe(response => {
        this.usersList = response.users;

        for (let i = 0; i < response.users.length; i++) {
          if (response.users[i].name == this.auth.userProfile.user_metadata.name && response.users[i].permission == this.auth.userProfile.user_metadata.permission) {
            this.LoggedUser.next(this.usersList[i]);
          }
        }
      });
    }
  }
  // this manages the logged user, and creates an observable, subscribe to LoggedUser$


}

