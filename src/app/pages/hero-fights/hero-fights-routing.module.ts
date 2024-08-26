import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeroFightsComponent } from './hero-fights.component';



const routes: Routes = [
  { path: '', component: HeroFightsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HeroFightsRoutingModule { }
