import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EarnedBiomeComponent } from './earned-biome.component';


const routes: Routes = [
  { path: '', component: EarnedBiomeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EarnedBiomeRoutingModule {
}
