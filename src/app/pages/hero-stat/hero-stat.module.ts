import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroStatComponent } from './hero-stat.component';
import { HeroStatRoutingModule } from './hero-stat-routing.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { IconsProviderModule } from '../../shared/icons/icons-provider.module';



@NgModule({
  declarations: [
    HeroStatComponent
  ],
  imports: [
    CommonModule,
    HeroStatRoutingModule,
    NzTableModule,
    IconsProviderModule,
  ],
})
export class HeroStatModule { }
