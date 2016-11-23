import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {DatabaseService} from "../../services/database.service";


@Component({
  selector: 'navbar',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

   loggedUser: any;

  constructor(private auth: AuthService,private dbServices: DatabaseService) {

  }

  ngOnInit() {
    this.dbServices.LoggedUser$.subscribe(response => this.loggedUser = response)
  }

}
