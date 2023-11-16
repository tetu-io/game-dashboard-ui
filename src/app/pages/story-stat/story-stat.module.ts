import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryStatComponent } from './story-stat.component';
import { StoryStatRoutingModule } from './story-stat-routing.module';
import { NzTableModule } from 'ng-zorro-antd/table';



@NgModule({
  declarations: [
    StoryStatComponent
  ],
  imports: [
    CommonModule,
    StoryStatRoutingModule,
    NzTableModule,
  ],
})
export class StoryStatModule { }
