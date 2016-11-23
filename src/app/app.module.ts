import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { TaskFormComponent } from './components/create-task/task-form.component';
import { HeaderComponent } from './components/header/header.component';
import {DatabaseService} from "./services/database.service";
import {OrderByPipe} from "./pipes/order-by.pipe";
import { ListTasksComponent } from './components/list-tasks/list-tasks.component';
import {AuthService} from "./services/auth.service";
import {AUTH_PROVIDERS} from "angular2-jwt";
import {MomentModule} from 'angular2-moment';
import {Ng2PaginationModule} from 'ng2-pagination';
import { EditTaskComponent } from './components/edit-task/edit-task.component';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { NameInitialsPipe } from './pipes/name-initials.pipe';
import { LoadingComponent } from './shared/loading.component';
import { SubstringPipe } from './pipes/substring.pipe';
import {AppRouting} from "./app.routing";
import { SettingsComponent } from './components/settings/settings.component';
import {AuthGuard} from "./shared/auth.guard";
import {LoginComponent} from "./components/login/login.component";
import { TaskDetailsComponent } from './components/task-details/task-details.component';
import {FilterPipe} from "./pipes/filter.pipe";
import { TableToolbarComponent } from './components/table-toolbar/table-toolbar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MarkdownToHtmlPipe } from './pipes/markdown-to-html.pipe';
import {AdminAuthGuard} from "./shared/admin-auth.guard";
import { TimeAgoPipe } from './pipes/time-ago.pipe';




@NgModule({
  declarations: [
    AppComponent,
    TaskFormComponent,
    HeaderComponent,
    OrderByPipe,
    ListTasksComponent,
    EditTaskComponent,
    CapitalizePipe,
    NameInitialsPipe,
    LoadingComponent,
    SubstringPipe,
    SettingsComponent,
    LoginComponent,
    TaskDetailsComponent,
    FilterPipe,
    TableToolbarComponent,
    DashboardComponent,
    MarkdownToHtmlPipe,
    TimeAgoPipe


  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MomentModule,
    AppRouting,
    Ng2PaginationModule,





  ],
  providers: [
    DatabaseService,
    AuthService,
    AUTH_PROVIDERS,
    AuthGuard,
    AdminAuthGuard

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
