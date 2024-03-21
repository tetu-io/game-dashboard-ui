import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TokenomicsStatComponent } from './tokenomics-stat.component';



const routes: Routes = [
  { path: '', component: TokenomicsStatComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TokenomicsStatRoutingModule { }
