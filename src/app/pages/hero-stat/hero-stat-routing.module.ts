import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeroStatComponent } from './hero-stat.component';


const routes: Routes = [
  { path: '', component: HeroStatComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HeroStatRoutingModule {
}
