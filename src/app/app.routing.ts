import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SettingsComponent} from "./components/settings/settings.component";
import {AuthGuard} from "./shared/auth.guard";
import {LoginComponent} from "./components/login/login.component";
import {ListTasksComponent} from "./components/list-tasks/list-tasks.component";
import {TaskDetailsComponent} from "./components/task-details/task-details.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {AdminAuthGuard} from "./shared/admin-auth.guard";




const routes: Routes = [
  {
    path: '', component: LoginComponent
  },
  {
    path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuard]
  },
  {
    path: 'settings', component: SettingsComponent, canActivate:[AdminAuthGuard]
  },
  {
    path: 'details/:id', component: TaskDetailsComponent, canActivate:[AuthGuard]
  },
  {
    path: '**', redirectTo: ''
  }

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRouting { }
