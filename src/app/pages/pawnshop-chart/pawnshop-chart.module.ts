import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PawnshopChartComponent } from './pawnshop-chart.component';
import { PawnshopChartRoutingModule } from './pawnshop-chart-routing.module';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NgxEchartsModule } from 'ngx-echarts';
import { NzSpinModule } from 'ng-zorro-antd/spin';



@NgModule({
  declarations: [
    PawnshopChartComponent
  ],
  imports: [
    CommonModule,
    PawnshopChartRoutingModule,
    NzEmptyModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    NzSpinModule,
  ]
})
export class PawnshopChartModule { }
