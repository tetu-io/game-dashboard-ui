import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StoryStatComponent } from './story-stat.component';


const routes: Routes = [
  { path: '', component: StoryStatComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoryStatRoutingModule {
}
