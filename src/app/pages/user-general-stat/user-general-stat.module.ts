import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserGeneralStatComponent } from './user-general-stat.component';
import { UserGeneralStatRoutingModule } from './user-general-stat-routing.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSpinModule } from 'ng-zorro-antd/spin';



@NgModule({
  declarations: [
    UserGeneralStatComponent
  ],
  imports: [
    CommonModule,
    UserGeneralStatRoutingModule,
    NzTableModule,
    NzSpinModule,
  ]
})
export class UserGeneralStatModule { }
