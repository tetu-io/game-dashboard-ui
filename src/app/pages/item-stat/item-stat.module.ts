import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemStatComponent } from './item-stat.component';
import { ItemStatRoutingModule } from './item-stat-routing.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSpinModule } from 'ng-zorro-antd/spin';



@NgModule({
  declarations: [
    ItemStatComponent
  ],
  imports: [
    CommonModule,
    ItemStatRoutingModule,
    NzTableModule,
    NzSpinModule,
  ],
})
export class ItemStatModule { }
