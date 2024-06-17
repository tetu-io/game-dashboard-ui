import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TotalSupllyChartComponent } from './total-suplly-chart.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NgxEchartsModule } from 'ngx-echarts';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { TotalSupllyChartRoutingModule } from './total-suplly-chart-routing.module';



@NgModule({
  declarations: [
    TotalSupllyChartComponent
  ],
  imports: [
    CommonModule,
    TotalSupllyChartRoutingModule,
    NzSpinModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    NzEmptyModule,
  ]
})
export class TotalSupllyChartModule { }
