import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TotalTxComponent } from './total-tx.component';
import { TotalTxRoutingModule } from './total-tx-routing.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSpinModule } from 'ng-zorro-antd/spin';



@NgModule({
  declarations: [
    TotalTxComponent
  ],
  imports: [
    CommonModule,
    TotalTxRoutingModule,
    NzEmptyModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    NzSpinModule,
  ],
})
export class TotalTxModule { }
