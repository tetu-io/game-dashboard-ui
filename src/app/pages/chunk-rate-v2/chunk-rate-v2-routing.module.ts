import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChunkRateV2Component } from './chunk-rate-v2.component';


const routes: Routes = [
  { path: '', component: ChunkRateV2Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChunkRateV2RoutingModule {
}
