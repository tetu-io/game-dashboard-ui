import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersRefComponent } from './users-ref.component';


const routes: Routes = [
  { path: '', component: UsersRefComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRefRoutingModule {
}
