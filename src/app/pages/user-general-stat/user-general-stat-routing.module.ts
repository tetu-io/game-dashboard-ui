import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserGeneralStatComponent } from './user-general-stat.component';


const routes: Routes = [
  { path: '', component: UserGeneralStatComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserGeneralStatRoutingModule {
}
