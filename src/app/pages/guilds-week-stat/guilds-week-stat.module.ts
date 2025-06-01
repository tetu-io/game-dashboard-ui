import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuildsWeekStatComponent } from './guilds-week-stat.component';
import { GuildsWeekStatRoutingModule } from './guilds-week-stat-routing.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTransitionPatchModule } from 'ng-zorro-antd/core/transition-patch/transition-patch.module';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzBadgeModule } from 'ng-zorro-antd/badge';



@NgModule({
  declarations: [
    GuildsWeekStatComponent
  ],
  imports: [
    CommonModule,
    GuildsWeekStatRoutingModule,
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
export class GuildsWeekStatModule { }
