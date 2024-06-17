import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PawnshopStatChartComponent } from './pawnshop-stat-chart.component';
import { PawnshopStatChartRoutingModule } from './pawnshop-stat-chart-routing.module';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NgxEchartsModule } from 'ngx-echarts';
import { NzSpinModule } from 'ng-zorro-antd/spin';



@NgModule({
  declarations: [
    PawnshopStatChartComponent
  ],
  imports: [
    CommonModule,
    PawnshopStatChartRoutingModule,
    NzEmptyModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    NzSpinModule,
  ]
})
export class PawnshopStatChartModule { }
