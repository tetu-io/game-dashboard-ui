import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfitIncomeComponent } from './profit-income.component';
import { ProfitIncomeRoutingModule } from './profit-income-routing.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSpinModule } from 'ng-zorro-antd/spin';



@NgModule({
  declarations: [
    ProfitIncomeComponent
  ],
  imports: [
    CommonModule,
    ProfitIncomeRoutingModule,
    NzEmptyModule,
    NzSpinModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ],
})
export class ProfitIncomeModule { }
