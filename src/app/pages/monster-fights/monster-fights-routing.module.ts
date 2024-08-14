import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonsterFightsComponent } from './monster-fights.component';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  { path: '', component: MonsterFightsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MonsterFightsRoutingModule { }
