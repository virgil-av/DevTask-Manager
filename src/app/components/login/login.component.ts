import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  constructor(public auth: AuthService, private router:Router) {

  }

  ngOnInit(){
    if(this.auth.authenticated()){
      this.router.navigate(['/dashboard']);
    }else{
      this.auth.login();
    }
  }


}

