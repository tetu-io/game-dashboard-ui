import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRatioEarnComponent } from './users-ratio-earn.component';
import { UsersRatioEarnRoutingModule } from './users-ratio-earn-routing.module';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NgxEchartsModule } from 'ngx-echarts';
import { NzSpinModule } from 'ng-zorro-antd/spin';



@NgModule({
  declarations: [
    UsersRatioEarnComponent,
  ],
  imports: [
    CommonModule,
    UsersRatioEarnRoutingModule,
    NzEmptyModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    NzSpinModule,
  ]
})
export class UsersRatioEarnModule { }
