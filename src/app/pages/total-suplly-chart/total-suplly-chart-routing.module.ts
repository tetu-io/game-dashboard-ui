import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TotalSupllyChartComponent } from './total-suplly-chart.component';



const routes: Routes = [
  { path: '', component: TotalSupllyChartComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TotalSupllyChartRoutingModule { }
