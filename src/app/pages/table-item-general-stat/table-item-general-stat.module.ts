import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableItemGeneralStatComponent } from './table-item-general-stat.component';
import { TableItemGeneralStatRoutingModule } from './table-item-general-stat-routing.module';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';



@NgModule({
  declarations: [
    TableItemGeneralStatComponent
  ],
  imports: [
    CommonModule,
    TableItemGeneralStatRoutingModule,
    NzSpinModule,
    NzTableModule,
    NzButtonModule,
    NzWaveModule,
    NzButtonModule,
  ],
})
export class TableItemGeneralStatModule { }
