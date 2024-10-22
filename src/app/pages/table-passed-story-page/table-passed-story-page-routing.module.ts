import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TablePassedStoryPageComponent } from './table-passed-story-page.component';


const routes: Routes = [
  { path: '', component: TablePassedStoryPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TablePassedStoryPageRoutingModule { }