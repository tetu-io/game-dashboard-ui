import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableItemGeneralStatComponent } from './table-item-general-stat.component';
import { TableItemGeneralStatRoutingModule } from './table-item-general-stat-routing.module';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';



@NgModule({
  declarations: [
    TableItemGeneralStatComponent
  ],
  imports: [
    CommonModule,
    TableItemGeneralStatRoutingModule,
    NzSpinModule,
    NzTableModule,
  ]
})
export class TableItemGeneralStatModule { }
