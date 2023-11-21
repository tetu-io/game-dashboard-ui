import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HeroDetailsComponent } from './hero-details.component';
import { HeroDetailsRoutingModule } from './hero-details-routing.module';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzSpinModule } from 'ng-zorro-antd/spin';



@NgModule({
  declarations: [
    HeroDetailsComponent
  ],
  imports: [
    CommonModule,
    HeroDetailsRoutingModule,
    NzFormModule,
    FormsModule,
    NzInputModule,
    NzButtonModule,
    NzDescriptionsModule,
    NzBadgeModule,
    NzSpinModule,
  ],
  providers: [DatePipe]
})
export class HeroDetailsModule { }
