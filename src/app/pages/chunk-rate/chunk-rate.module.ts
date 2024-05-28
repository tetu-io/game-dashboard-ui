import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChunkRateComponent } from './chunk-rate.component';
import { ChunkRateRoutingModule } from './chunk-rate-routing.module';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NgxEchartsModule } from 'ngx-echarts';
import { NzSpinModule } from 'ng-zorro-antd/spin';



@NgModule({
  declarations: [
    ChunkRateComponent
  ],
  imports: [
    CommonModule,
    ChunkRateRoutingModule,
    NzEmptyModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    NzSpinModule,
  ]
})
export class ChunkRateModule { }
