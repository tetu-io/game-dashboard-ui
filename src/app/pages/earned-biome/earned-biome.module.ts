import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EarnedBiomeComponent } from './earned-biome.component';
import { EarnedBiomeRoutingModule } from './earned-biome-routing.module';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NgxEchartsModule } from 'ngx-echarts';
import { NzSpinModule } from 'ng-zorro-antd/spin';



@NgModule({
  declarations: [
    EarnedBiomeComponent
  ],
  imports: [
    CommonModule,
    EarnedBiomeRoutingModule,
    NzEmptyModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    NzSpinModule,
  ]
})
export class EarnedBiomeModule { }
