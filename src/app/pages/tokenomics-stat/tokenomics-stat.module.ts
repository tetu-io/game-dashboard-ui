import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenomicsStatComponent } from './tokenomics-stat.component';
import { TokenomicsStatRoutingModule } from './tokenomics-stat-routing.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSpinModule } from 'ng-zorro-antd/spin';



@NgModule({
  declarations: [
    TokenomicsStatComponent
  ],
  imports: [
    CommonModule,
    TokenomicsStatRoutingModule,
    NzSpinModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    NzEmptyModule,
  ],
})
export class TokenomicsStatModule { }
