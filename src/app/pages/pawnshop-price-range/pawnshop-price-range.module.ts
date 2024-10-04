import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PawnshopPriceRangeComponent } from './pawnshop-price-range.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NgxEchartsModule } from 'ngx-echarts';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { PawnshopPriceRangeRoutingModule } from './pawnshop-price-range-routing.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTransitionPatchModule } from 'ng-zorro-antd/core/transition-patch/transition-patch.module';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzBadgeModule } from 'ng-zorro-antd/badge';



@NgModule({
  declarations: [
    PawnshopPriceRangeComponent
  ],
  imports: [
    CommonModule,
    PawnshopPriceRangeRoutingModule,
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
    ReactiveFormsModule,
    NgxEchartsModule,
    NzEmptyModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ],
})
export class PawnshopPriceRangeModule { }
