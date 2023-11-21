import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryStatComponent } from './story-stat.component';
import { StoryStatRoutingModule } from './story-stat-routing.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSpinModule } from 'ng-zorro-antd/spin';



@NgModule({
  declarations: [
    StoryStatComponent
  ],
  imports: [
    CommonModule,
    StoryStatRoutingModule,
    NzTableModule,
    NzSpinModule,
  ],
})
export class StoryStatModule { }
