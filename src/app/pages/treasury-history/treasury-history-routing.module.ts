import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TreasuryHistoryComponent } from './treasury-history.component';



const routes: Routes = [
  { path: '', component: TreasuryHistoryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TreasuryHistoryRoutingModule { }
