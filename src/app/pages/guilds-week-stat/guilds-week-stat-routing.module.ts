import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GuildsWeekStatComponent } from './guilds-week-stat.component';


const routes: Routes = [
  { path: '', component: GuildsWeekStatComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuildsWeekStatRoutingModule {
}
