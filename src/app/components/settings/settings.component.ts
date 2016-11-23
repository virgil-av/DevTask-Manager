import {Component, OnInit} from "@angular/core";
import {Validators, FormGroup, FormBuilder} from "@angular/forms";
import {DatabaseService} from "../../services/database.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  addUser: FormGroup;
  addCategory: FormGroup;
  categorySettings: any;
  usersSettings: any;
  anyErrors: Error;
  toggleUser: any;
  formState: string = "add";
  selectedUserName: string;
  selectedUserPermission: string;
  selectedUserId: string;
  toggleCategory: any;
  categoryFormState: string = "add";
  selectedCategoryName: string;


  constructor(private dbService: DatabaseService,
              private formBuilder: FormBuilder) {
    this.addUser = formBuilder.group({
      'email': ['', [Validators.required]],
      'password': ['', [Validators.required]],
      'user_metadata': formBuilder.group({
        'name': ['', [Validators.required]],
        'permission': ['user', [Validators.required]]
      }),
      'connection': ['Username-Password-Authentication'],

    });

    this.addCategory = formBuilder.group({
      'name': ['', [Validators.required]]
    })

  }

  ngOnInit() {
    this.dbService.getCategorySettings()
      .subscribe(response => this.categorySettings = response,
        error => this.anyErrors = error
      );

    this.dbService.getUsersSettings()
      .subscribe(response => this.usersSettings = response,
        error => this.anyErrors = error
      );


  }

  onUserSubmit() {
    this.dbService.createAuth0User(this.addUser.value).subscribe(Auth0Response => {

      let user = {
        "name": Auth0Response.user_metadata.name,
        "email": Auth0Response.email,
        "permission": Auth0Response.user_metadata.permission,
        "date": new Date(),
        "id": Auth0Response.user_id
      }

      this.usersSettings.users.push(user);

      this.dbService.sendUserToDb(this.usersSettings).subscribe(response => {
          this.toggleUser = false;
          this.addUser.reset({user_metadata: {permission: 'user'}, connection:'Username-Password-Authentication'});
        },
        error => this.anyErrors = error)
    })
  }

  removeUser(id) {
    for (let i = 0; i < this.usersSettings.users.length; i++) {
      if (this.usersSettings.users[i].id == id) {
        this.dbService.deleteAuth0User(id).subscribe(response => {
          this.usersSettings.users.splice(i, 1);
          this.dbService.sendUserToDb(this.usersSettings).subscribe(response => response,
            error => this.anyErrors = error)
        });

      }
    }
  }

  onCategorySubmit() {
    if (this.categoryFormState == 'add') {

      this.categorySettings.categories.push(this.addCategory.value);
      this.dbService.sendCategoryToDb(this.categorySettings).subscribe(response => {
          this.addCategory.reset();
          this.toggleCategory = false;
        },
        error => this.anyErrors = error);
    } else if (this.categoryFormState == 'edit') {

      for (let i = 0; i < this.categorySettings.categories.length; i++) {
        if (this.categorySettings.categories[i].name == this.selectedCategoryName) {
          this.categorySettings.categories.splice(i, 1, this.addCategory.value);
          this.dbService.sendCategoryToDb(this.categorySettings).subscribe(response => {
              this.categoryFormState = 'add';
              this.toggleCategory = false;
              this.addCategory.reset();
            },
            error => this.anyErrors = error);
        }
      }
    }


  }

  removeCategory(id) {
    for (let i = 0; i < this.categorySettings.categories.length; i++) {
      if (this.categorySettings.categories[i].name == id) {
        this.categorySettings.categories.splice(i, 1)
      }
    }
    this.dbService.sendCategoryToDb(this.categorySettings).subscribe(response => response,
      error => this.anyErrors = error);

  }

  userToggle() {
    this.toggleUser = !this.toggleUser
  }

  categoryToggle() {
    this.toggleCategory = !this.toggleCategory
  }

  editUser(name, permission, id) {
    this.formState = 'edit';
    this.selectedUserName = name;
    this.selectedUserPermission = permission;
    this.toggleUser = true;
    this.selectedUserId = id

  }

  onUserEdit(form) {


    for (let i = 0; i < this.usersSettings.users.length; i++) {
      if (this.usersSettings.users[i].id == this.selectedUserId) {

        let editedUserAuth0 = {
          "user_metadata": {
            "name": form.value.name,
            "permission": form.value.permission
          }
        }

        this.dbService.editAuth0User(editedUserAuth0, this.usersSettings.users[i].id).subscribe(result => {
            let editedUser = {
              "name": form.value.name,
              "email": this.usersSettings.users[i].email,
              "permission": form.value.permission,
              "date": new Date(),
              "id": this.usersSettings.users[i].id
            }

            this.usersSettings.users.splice(i, 1, editedUser);

            this.dbService.sendUserToDb(this.usersSettings).subscribe(response => {
                this.formState = 'add';
                this.toggleUser = false;
              },
              error => this.anyErrors = error

            )},
          error => this.anyErrors = error

        )}
    }

  }

  editCategory(name) {
    this.addCategory.patchValue({name: name});
    this.categoryFormState = 'edit';
    this.selectedCategoryName = name;
    this.toggleCategory = true;
  }

  resetToDefault() {
    this.categoryFormState = 'add';
    this.formState = 'add'
    this.toggleCategory = false;
    this.toggleUser = false;
  }


}
