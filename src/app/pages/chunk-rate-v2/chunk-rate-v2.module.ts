import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChunkRateV2Component } from './chunk-rate-v2.component';
import { ChunkRateV2RoutingModule } from './chunk-rate-v2-routing.module';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NgxEchartsModule } from 'ngx-echarts';
import { NzSpinModule } from 'ng-zorro-antd/spin';



@NgModule({
  declarations: [
    ChunkRateV2Component
  ],
  imports: [
    CommonModule,
    ChunkRateV2RoutingModule,
    NzEmptyModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    NzSpinModule,
  ]
})
export class ChunkRateV2Module { }
