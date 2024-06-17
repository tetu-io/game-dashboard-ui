import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PawnshopStatChartComponent } from './pawnshop-stat-chart.component';


const routes: Routes = [
  { path: '', component: PawnshopStatChartComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PawnshopStatChartRoutingModule {
}
