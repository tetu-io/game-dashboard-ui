import { NgModule } from '@angular/core';
import { TokenomicsComponent } from './tokenomics.component';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  { path: '', component: TokenomicsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TokenomicsRoutingModule { }
