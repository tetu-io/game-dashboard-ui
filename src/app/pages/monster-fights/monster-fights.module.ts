import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonsterFightsComponent } from './monster-fights.component';
import { MonsterFightsRoutingModule } from './monster-fights-routing.module';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzSelectModule } from 'ng-zorro-antd/select';



@NgModule({
  declarations: [
    MonsterFightsComponent
  ],
  imports: [
    CommonModule,
    MonsterFightsRoutingModule,
    NzSpinModule,
    NzTableModule,
    NzWaveModule,
    NzFormModule,
    FormsModule,
    NzInputModule,
    NzButtonModule,
    NzDescriptionsModule,
    NzBadgeModule,
    NzSelectModule,
  ],
})
export class MonsterFightsModule { }
