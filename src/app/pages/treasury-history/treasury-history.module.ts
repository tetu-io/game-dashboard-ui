import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreasuryHistoryComponent } from './treasury-history.component';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NgxEchartsModule } from 'ngx-echarts';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { TreasuryHistoryRoutingModule } from './treasury-history-routing.module';



@NgModule({
  declarations: [
    TreasuryHistoryComponent
  ],
  imports: [
    CommonModule,
    NzEmptyModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    TreasuryHistoryRoutingModule,
    NzSpinModule,
  ]
})
export class TreasuryHistoryModule { }
