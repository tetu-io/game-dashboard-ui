import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TotalTxComponent } from './total-tx.component';



const routes: Routes = [
  { path: '', component: TotalTxComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TotalTxRoutingModule { }
