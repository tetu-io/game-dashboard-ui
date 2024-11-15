import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReinforcementV2Component } from './reinforcement-v2.component';


const routes: Routes = [
  { path: '', component: ReinforcementV2Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReinforcementV2RoutingModule {
}
