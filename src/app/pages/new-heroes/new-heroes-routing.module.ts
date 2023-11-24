import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewHeroesComponent } from './new-heroes.component';


const routes: Routes = [
  { path: '', component: NewHeroesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewHeroesRoutingModule {
}
