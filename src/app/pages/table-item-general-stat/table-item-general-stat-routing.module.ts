import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableItemGeneralStatComponent } from './table-item-general-stat.component';


const routes: Routes = [
  { path: '', component: TableItemGeneralStatComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TableItemGeneralStatRoutingModule { }