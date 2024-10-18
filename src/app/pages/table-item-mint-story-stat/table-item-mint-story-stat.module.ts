import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableItemMintStoryStatComponent } from './table-item-mint-story-stat.component';
import { TableItemMintStoryStatRoutingModule } from './table-item-mint-story-stat-routing.module';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';



@NgModule({
  declarations: [
    TableItemMintStoryStatComponent
  ],
  imports: [
    CommonModule,
    TableItemMintStoryStatRoutingModule,
    NzSpinModule,
    NzTableModule,
    NzButtonModule,
    NzWaveModule,
  ],
})
export class TableItemMintStoryStatModule { }
