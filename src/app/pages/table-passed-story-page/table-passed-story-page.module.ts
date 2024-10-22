import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablePassedStoryPageComponent } from './table-passed-story-page.component';
import { TablePassedStoryPageRoutingModule } from './table-passed-story-page-routing.module';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';



@NgModule({
  declarations: [
    TablePassedStoryPageComponent
  ],
  imports: [
    CommonModule,
    TablePassedStoryPageRoutingModule,
    NzSpinModule,
    NzTableModule,
    NzButtonModule,
    NzWaveModule,
  ]
})
export class TablePassedStoryPageModule { }
