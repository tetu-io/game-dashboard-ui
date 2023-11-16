import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemStatComponent } from './item-stat.component';


const routes: Routes = [
  { path: '', component: ItemStatComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemStatRoutingModule {
}
