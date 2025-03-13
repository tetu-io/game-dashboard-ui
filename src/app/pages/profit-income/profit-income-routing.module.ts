import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfitIncomeComponent } from './profit-income.component';


const routes: Routes = [
  { path: '', component: ProfitIncomeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfitIncomeRoutingModule {
}
