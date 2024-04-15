import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PawnshopChartComponent } from './pawnshop-chart.component';


const routes: Routes = [
  { path: '', component: PawnshopChartComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PawnshopChartRoutingModule {
}
