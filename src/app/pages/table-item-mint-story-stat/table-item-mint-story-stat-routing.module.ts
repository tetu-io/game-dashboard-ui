import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableItemMintStoryStatComponent } from './table-item-mint-story-stat.component';


const routes: Routes = [
  { path: '', component: TableItemMintStoryStatComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TableItemMintStoryStatRoutingModule { }