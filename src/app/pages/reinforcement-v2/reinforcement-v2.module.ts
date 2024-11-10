import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReinforcementV2Component } from './reinforcement-v2.component';
import { ReinforcementV2RoutingModule } from './reinforcement-v2-routing.module';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';



@NgModule({
  declarations: [
    ReinforcementV2Component
  ],
  imports: [
    CommonModule,
    ReinforcementV2RoutingModule,
    NzSpinModule,
    NzTableModule,
    NzButtonModule,
    NzWaveModule,
  ]
})
export class ReinforcementV2Module { }
