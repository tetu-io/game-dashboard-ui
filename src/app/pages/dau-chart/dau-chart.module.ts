import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DauChartComponent } from './dau-chart.component';
import { DauChartRoutingModule } from './dau-chart-routing.module';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NgxEchartsModule } from 'ngx-echarts';
import { NzSpinModule } from 'ng-zorro-antd/spin';



@NgModule({
  declarations: [
    DauChartComponent
  ],
  imports: [
    CommonModule,
    DauChartRoutingModule,
    NzEmptyModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    NzSpinModule,
  ]
})
export class DauChartModule { }
