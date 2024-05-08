import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersRatioEarnComponent } from './users-ratio-earn.component';


const routes: Routes = [
  { path: '', component: UsersRatioEarnComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRatioEarnRoutingModule {
}
