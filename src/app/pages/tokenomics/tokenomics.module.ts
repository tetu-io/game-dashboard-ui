import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenomicsComponent } from './tokenomics.component';
import { TokenomicsRoutingModule } from './tokenomics-routing.module';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpinModule } from 'ng-zorro-antd/spin';



@NgModule({
  declarations: [
    TokenomicsComponent
  ],
  imports: [
    CommonModule,
    TokenomicsRoutingModule,
    NzStatisticModule,
    NzGridModule,
    NzSpinModule,
  ],
})
export class TokenomicsModule { }
