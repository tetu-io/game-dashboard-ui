import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableItemMintStoryStatComponent } from './table-item-mint-story-stat.component';
import { TableItemMintStoryStatRoutingModule } from './table-item-mint-story-stat-routing.module';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';



@NgModule({
  declarations: [
    TableItemMintStoryStatComponent
  ],
  imports: [
    CommonModule,
    TableItemMintStoryStatRoutingModule,
    NzSpinModule,
    NzTableModule,
  ]
})
export class TableItemMintStoryStatModule { }
