import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PawnshopPriceRangeComponent } from './pawnshop-price-range.component';


const routes: Routes = [
  { path: '', component: PawnshopPriceRangeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PawnshopPriceRangeRoutingModule {
}
