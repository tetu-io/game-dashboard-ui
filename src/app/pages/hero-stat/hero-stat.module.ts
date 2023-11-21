import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroStatComponent } from './hero-stat.component';
import { HeroStatRoutingModule } from './hero-stat-routing.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { IconsProviderModule } from '../../shared/icons/icons-provider.module';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';



@NgModule({
  declarations: [
    HeroStatComponent
  ],
  imports: [
    CommonModule,
    HeroStatRoutingModule,
    NzTableModule,
    IconsProviderModule,
    NzFormModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzSpinModule,
  ],
})
export class HeroStatModule { }
