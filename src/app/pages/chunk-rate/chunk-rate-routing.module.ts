import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChunkRateComponent } from './chunk-rate.component';


const routes: Routes = [
  { path: '', component: ChunkRateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChunkRateRoutingModule {
}
